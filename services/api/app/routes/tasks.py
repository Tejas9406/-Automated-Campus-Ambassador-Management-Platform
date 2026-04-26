from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..db import IN_MEMORY, get_db
from ..schemas import Task, TaskCreateRequest, TaskUpdateRequest
from ..util import new_id, now_utc

router = APIRouter(prefix="/tasks", tags=["tasks"])


def _doc_to_task(doc: dict) -> Task:
    return Task(
        id=str(doc["id"]),
        ambassador_username=doc["ambassador_username"],
        title=doc["title"],
        description=doc.get("description"),
        status=doc.get("status", "todo"),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


@router.post("", response_model=Task)
async def create_task(body: TaskCreateRequest) -> Task:
    doc = {
        "id": new_id(),
        "ambassador_username": body.ambassador_username,
        "title": body.title,
        "description": body.description,
        "status": "todo",
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }

    db = get_db()
    if db is None:
        IN_MEMORY["tasks"][doc["id"]] = doc
        return _doc_to_task(doc)

    await db.tasks.insert_one(doc)
    return _doc_to_task(doc)


@router.get("", response_model=list[Task])
async def list_tasks(ambassador_username: str | None = None) -> list[Task]:
    db = get_db()
    if db is None:
        items = list(IN_MEMORY["tasks"].values())
        if ambassador_username:
            items = [d for d in items if d["ambassador_username"] == ambassador_username]
        items.sort(key=lambda d: d["updated_at"], reverse=True)
        return [_doc_to_task(d) for d in items]

    q = {}
    if ambassador_username:
        q["ambassador_username"] = ambassador_username
    cursor = db.tasks.find(q).sort("updated_at", -1)
    docs = await cursor.to_list(length=200)
    return [_doc_to_task(d) for d in docs]


@router.patch("/{task_id}", response_model=Task)
async def update_task(task_id: str, body: TaskUpdateRequest) -> Task:
    db = get_db()

    if db is None:
        doc = IN_MEMORY["tasks"].get(task_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Task not found")
        if body.status is not None:
            doc["status"] = body.status
        if body.title is not None:
            doc["title"] = body.title
        if body.description is not None:
            doc["description"] = body.description
        doc["updated_at"] = now_utc()
        return _doc_to_task(doc)

    update: dict = {"$set": {"updated_at": now_utc()}}
    if body.status is not None:
        update["$set"]["status"] = body.status
    if body.title is not None:
        update["$set"]["title"] = body.title
    if body.description is not None:
        update["$set"]["description"] = body.description

    doc = await db.tasks.find_one_and_update(
        {"id": task_id},
        update,
        return_document=True,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Task not found")
    return _doc_to_task(doc)

