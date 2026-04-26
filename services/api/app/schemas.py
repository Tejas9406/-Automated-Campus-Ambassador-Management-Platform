from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    ok: bool = True
    service: str
    environment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class GitHubRepoLite(BaseModel):
    name: str
    full_name: str
    html_url: str
    description: str | None = None
    language: str | None = None
    stargazers_count: int = 0
    forks_count: int = 0
    open_issues_count: int = 0
    updated_at: str | None = None


class GitHubPulseResponse(BaseModel):
    username: str
    score: int = Field(ge=1, le=100)
    top_repos: list[GitHubRepoLite]
    recruiter_tips: list[str] = Field(min_length=3, max_length=3)
    signals: dict[str, float | int | str]
    generated_by: Literal["gemini", "heuristic"]


class TaskStatus(str):
    pass


class Task(BaseModel):
    id: str
    ambassador_username: str
    title: str
    description: str | None = None
    status: Literal["todo", "doing", "done"] = "todo"
    created_at: datetime
    updated_at: datetime


class TaskCreateRequest(BaseModel):
    ambassador_username: str
    title: str
    description: str | None = None


class TaskUpdateRequest(BaseModel):
    status: Literal["todo", "doing", "done"] | None = None
    title: str | None = None
    description: str | None = None


class LeaderboardEntry(BaseModel):
    ambassador_username: str
    github_score: int = Field(ge=1, le=100)
    tasks_done: int = 0
    tasks_total: int = 0
    points: int = 0


class LeaderboardResponse(BaseModel):
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    entries: list[LeaderboardEntry]

