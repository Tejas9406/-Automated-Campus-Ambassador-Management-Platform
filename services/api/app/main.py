from __future__ import annotations

from datetime import datetime

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import close_db, connect_db, get_db
from .gemini import score_with_gemini
from .github import fetch_top_repos, heuristic_recruiter_score, heuristic_tips
from .routes.leaderboard import router as leaderboard_router
from .routes.tasks import router as tasks_router
from .schemas import GitHubPulseResponse, HealthResponse

app = FastAPI(title=settings.app_name)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)
app.include_router(leaderboard_router)


@app.on_event("startup")
async def _startup() -> None:
    await connect_db()


@app.on_event("shutdown")
async def _shutdown() -> None:
    await close_db()


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(service=settings.app_name, environment=settings.environment)


@app.get("/github/pulse", response_model=GitHubPulseResponse)
async def github_pulse(
    username: str = Query(min_length=1, max_length=39, pattern=r"^[A-Za-z0-9-]+$"),
) -> GitHubPulseResponse:
    try:
        repos = await fetch_top_repos(username=username, limit=3)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"GitHub fetch failed: {e}")

    # If Gemini is configured, use it; else fallback heuristic.
    generated_by = "heuristic"
    signals: dict[str, float | int | str] = {}
    try:
        score, tips, model_signals = await score_with_gemini(username, repos)
        generated_by = "gemini"
        signals = {**model_signals}
    except Exception:
        score, signals = heuristic_recruiter_score(repos)
        tips = heuristic_tips(repos)

    # Optional: store/update leaderboard entry in Mongo if configured.
    db = get_db()
    if db is not None:
        await db.leaderboard.update_one(
            {"ambassador_username": username},
            {
                "$set": {
                    "ambassador_username": username,
                    "github_score": int(score),
                    "updated_at": datetime.utcnow(),
                }
            },
            upsert=True,
        )
    else:
        # Keep leaderboard current in demo mode.
        from .db import IN_MEMORY

        IN_MEMORY["leaderboard"][username] = {
            "ambassador_username": username,
            "github_score": int(score),
            "updated_at": datetime.utcnow(),
        }

    return GitHubPulseResponse(
        username=username,
        score=int(score),
        top_repos=repos,
        recruiter_tips=tips,
        signals=signals,
        generated_by=generated_by,  # type: ignore[arg-type]
    )

