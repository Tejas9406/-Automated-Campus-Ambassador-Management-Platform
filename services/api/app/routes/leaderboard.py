from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter

from ..db import IN_MEMORY, get_db
from ..schemas import LeaderboardEntry, LeaderboardResponse

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


def _compute_points(github_score: int, tasks_done: int, tasks_total: int) -> int:
    completion = 0
    if tasks_total > 0:
        completion = int((tasks_done / tasks_total) * 40)
    return int(github_score) + completion


@router.get("", response_model=LeaderboardResponse)
async def get_leaderboard(limit: int = 25) -> LeaderboardResponse:
    db = get_db()

    entries: list[LeaderboardEntry] = []

    if db is None:
        # Aggregate from in-memory stores.
        tasks = list(IN_MEMORY["tasks"].values())
        users = IN_MEMORY["leaderboard"].values()
        for u in users:
            username = u["ambassador_username"]
            user_tasks = [t for t in tasks if t["ambassador_username"] == username]
            done = sum(1 for t in user_tasks if t.get("status") == "done")
            total = len(user_tasks)
            score = int(u.get("github_score") or 50)
            entries.append(
                LeaderboardEntry(
                    ambassador_username=username,
                    github_score=score,
                    tasks_done=done,
                    tasks_total=total,
                    points=_compute_points(score, done, total),
                )
            )
        entries.sort(key=lambda e: e.points, reverse=True)
        return LeaderboardResponse(updated_at=datetime.utcnow(), entries=entries[:limit])

    # Mongo path: join leaderboard + tasks counts.
    leaderboard_docs = await db.leaderboard.find({}).to_list(length=500)
    for u in leaderboard_docs:
        username = u["ambassador_username"]
        total = await db.tasks.count_documents({"ambassador_username": username})
        done = await db.tasks.count_documents({"ambassador_username": username, "status": "done"})
        score = int(u.get("github_score") or 50)
        entries.append(
            LeaderboardEntry(
                ambassador_username=username,
                github_score=score,
                tasks_done=int(done),
                tasks_total=int(total),
                points=_compute_points(score, int(done), int(total)),
            )
        )
    entries.sort(key=lambda e: e.points, reverse=True)
    return LeaderboardResponse(updated_at=datetime.utcnow(), entries=entries[:limit])

