# CampusConnect
### Scaling Communities through Data-Driven Advocacy

CampusConnect is a **startup-grade Campus Ambassador Management Platform** with an integrated **AI GitHub Auditor**.
It turns CA programs from spreadsheets into an **ROI-positive growth engine**—with measurable progress, gamified execution, and recruiter-ready coaching.

## What you get

- **GitHub Pulse**: fetch GitHub repo signals → **Recruiter-Ready Score (1–100)** + **3 actionable tips**
- **Smart Tasks**: structured growth tasks (todo → doing → done) tracked per ambassador
- **Leaderboard**: real-time ranking by **GitHub strength + completion points**
- **Premium UX**: dark, high-contrast (Slate-950 / Cyan-400) with motion-first micro-interactions

## Screens (add screenshots)

- `docs/screenshots/landing.png`
- `docs/screenshots/pulse.png`
- `docs/screenshots/tasks.png`
- `docs/screenshots/leaderboard.png`

## Architecture (Decoupled Microservices)

```
Next.js (apps/web)  ──fetch──►  FastAPI (services/api)  ──► MongoDB Atlas
         ▲                          │
         └──────── UI ──────────────┴──► GitHub API + Gemini (optional)
```

## Product routes

- **Landing**: `/`
- **GitHub Pulse**: `/pulse`
- **Smart Tasks**: `/tasks`
- **Leaderboard**: `/leaderboard`

## Repo structure

- `apps/web` — Next.js 16 (App Router) + Tailwind + Framer Motion + Lucide + dark-mode
- `services/api` — FastAPI + GitHub fetcher + Gemini scoring (optional) + Mongo (optional)

## Quickstart (Windows)

### Backend (FastAPI)

```powershell
cd services\api
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\uvicorn services.api.app.main:app --reload --port 8000
```

Verify:

- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/github/pulse?username=octocat`

### Frontend (Next.js)

```powershell
cd apps\web
npm install
$env:NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
npm run dev
```

Open `http://localhost:3000`.

## Environment variables (safe, gitignored)

Create **local** env files (never commit them):

- `apps/web/.env.local`
- `services/api/.env`

Backend `.env` example:

```env
# Optional Mongo (persists tasks + leaderboard)
MONGODB_URI="mongodb+srv://..."
MONGODB_DB="campusconnect"

# Optional GitHub token (higher rate limits)
GITHUB_TOKEN="your_token"

# Optional Gemini (better recruiter tips)
GEMINI_API_KEY="your_key"
GEMINI_MODEL="gemini-2.0-flash"
```

## API endpoints (minimal)

- `GET /health`
- `GET /github/pulse?username={handle}`
- `GET /tasks?ambassador_username={handle}`
- `POST /tasks`
- `PATCH /tasks/{task_id}`
- `GET /leaderboard`


