from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from .config import settings

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None

# In-memory fallback for hackathon/demo mode when Mongo isn't configured.
IN_MEMORY: dict[str, dict] = {
    "tasks": {},  # id -> task doc
    "leaderboard": {},  # username -> leaderboard doc
}


def get_db() -> AsyncIOMotorDatabase | None:
    return _db


async def connect_db() -> None:
    global _client, _db
    if not settings.mongodb_uri:
        _client = None
        _db = None
        return
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    _db = _client[settings.mongodb_db]


async def close_db() -> None:
    global _client, _db
    if _client is not None:
        _client.close()
    _client = None
    _db = None

