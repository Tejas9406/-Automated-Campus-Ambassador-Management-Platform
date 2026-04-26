from __future__ import annotations

import math
from typing import Any

import httpx

from .config import settings
from .schemas import GitHubRepoLite


async def fetch_top_repos(username: str, limit: int = 3) -> list[GitHubRepoLite]:
    headers = {"Accept": "application/vnd.github+json"}
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(
            f"https://api.github.com/users/{username}/repos",
            headers=headers,
            params={"per_page": 100, "sort": "updated"},
        )
        resp.raise_for_status()
        repos: list[dict[str, Any]] = resp.json()

    # Pick top repos by stars (tie-breaker: forks + recency)
    def score_repo(r: dict[str, Any]) -> float:
        stars = int(r.get("stargazers_count") or 0)
        forks = int(r.get("forks_count") or 0)
        issues = int(r.get("open_issues_count") or 0)
        return stars * 3 + forks * 2 - issues * 0.25

    repos_sorted = sorted(repos, key=score_repo, reverse=True)
    picked = repos_sorted[: max(1, limit)]

    return [
        GitHubRepoLite(
            name=r.get("name", ""),
            full_name=r.get("full_name", ""),
            html_url=r.get("html_url", ""),
            description=r.get("description"),
            language=r.get("language"),
            stargazers_count=int(r.get("stargazers_count") or 0),
            forks_count=int(r.get("forks_count") or 0),
            open_issues_count=int(r.get("open_issues_count") or 0),
            updated_at=r.get("updated_at"),
        )
        for r in picked
    ]


def heuristic_recruiter_score(repos: list[GitHubRepoLite]) -> tuple[int, dict[str, float | int | str]]:
    stars = sum(r.stargazers_count for r in repos)
    forks = sum(r.forks_count for r in repos)
    has_desc = sum(1 for r in repos if (r.description or "").strip())
    langs = {r.language for r in repos if r.language}

    # Gentle, bounded score. Designed to "feel" recruiter-like.
    base = 35
    s = base
    s += int(15 * (1 - math.exp(-stars / 10)))
    s += int(10 * (1 - math.exp(-forks / 8)))
    s += int(10 * (has_desc / max(1, len(repos))))
    s += int(10 * min(1.0, len(langs) / 3))

    s = max(1, min(100, s))

    signals: dict[str, float | int | str] = {
        "stars_top3": stars,
        "forks_top3": forks,
        "repos_with_description": has_desc,
        "unique_languages_top3": len(langs),
    }
    return s, signals


def heuristic_tips(repos: list[GitHubRepoLite]) -> list[str]:
    tips: list[str] = []
    if any(not (r.description or "").strip() for r in repos):
        tips.append("Add crisp one-line repo descriptions (problem → solution → stack).")
    tips.append("Upgrade READMEs with: demo GIF, setup steps, architecture diagram, and impact metrics.")
    tips.append("Pin 3 projects that show scope + ownership; add issues/PRs and a clean release tag.")
    return tips[:3]

