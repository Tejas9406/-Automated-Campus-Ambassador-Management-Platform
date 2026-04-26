from __future__ import annotations

from typing import Any

from .config import settings
from .schemas import GitHubRepoLite


async def score_with_gemini(username: str, repos: list[GitHubRepoLite]) -> tuple[int, list[str], dict[str, Any]]:
    """
    Optional Gemini integration.
    If the Gemini SDK isn't installed or API key missing, caller should fall back.
    """
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY not set")

    prompt = {
        "role": "user",
        "parts": [
            {
                "text": (
                    "You are a senior technical recruiter. Score the candidate's GitHub presence from 1-100 "
                    "based ONLY on the provided repo metadata (no browsing). Return JSON with keys:\n"
                    "- score: integer 1..100\n"
                    "- recruiter_tips: array of EXACTLY 3 short actionable tips\n"
                    "- signals: object of 3-6 numeric or short string signals\n\n"
                    f"Candidate username: {username}\n"
                    f"Top repos (JSON): { [r.model_dump() for r in repos] }\n"
                    "Return ONLY JSON."
                )
            }
        ],
    }

    try:
        # Prefer the new Google GenAI package if present.
        from google import genai  # type: ignore

        client = genai.Client(api_key=settings.gemini_api_key)
        res = client.models.generate_content(
            model=settings.gemini_model,
            contents=[prompt],
            config={"response_mime_type": "application/json"},
        )
        text = res.text or "{}"
    except Exception:
        # Fallback to older google-generativeai if present.
        import google.generativeai as genai  # type: ignore

        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.gemini_model)
        res = model.generate_content(
            prompt["parts"][0]["text"],
            generation_config={"response_mime_type": "application/json"},
        )
        text = getattr(res, "text", None) or "{}"

    import json

    data = json.loads(text)
    score = int(data.get("score", 50))
    tips = list(data.get("recruiter_tips", []))[:3]
    if len(tips) != 3:
        raise RuntimeError("Gemini output missing 3 tips")
    signals = data.get("signals", {}) if isinstance(data.get("signals", {}), dict) else {}
    score = max(1, min(100, score))
    tips = [str(t).strip() for t in tips]
    return score, tips, signals

