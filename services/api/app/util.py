from __future__ import annotations

from datetime import datetime
from uuid import uuid4


def now_utc() -> datetime:
    return datetime.utcnow()


def new_id() -> str:
    return uuid4().hex

