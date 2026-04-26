# CampusConnect: Scaling Communities through Data-Driven Advocacy

**CampusConnect** is a centralized platform for managing Campus Ambassadors with an integrated **AI GitHub Auditor**.
It upgrades CA programs from spreadsheets into an **ROI-positive growth engine**—with measurable outcomes, leaderboards, and recruiter-ready developer coaching.

## Why it wins hackathons

- **GitHub Pulse (Impact)**: 1–100 recruiter-style score + 3 actionable tips in seconds
- **Smart Task Workflow (Technical)**: structured growth tasks with status tracking
- **Leaderboard (Innovation)**: rank ambassadors by GitHub strength + completion
- **Premium UX (Design)**: dark, high-contrast (Slate-950 / Cyan-400), motion-first UI

## Architecture (Decoupled Microservices)

- **Frontend**: Next.js (App Router) + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB Atlas (optional; demo mode works without it)
- **AI Engine**: Gemini (optional; falls back to a fast heuristic score)

## Live features

- **Landing**: `/`
- **GitHub Pulse**: `/pulse`
- **Tasks**: `/tasks`
- **Leaderboard**: `/leaderboard`

## Repo structure

- `apps/web` — Next.js frontend
- `services/api` — FastAPI backend

## Quickstart (Windows)

### 1) Backend

```powershell
cd services\api
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\uvicorn services.api.app.main:app --reload --port 8000
```

### 2) Frontend

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
MONGODB_URI="mongodb+srv://..."
MONGODB_DB="campusconnect"
GITHUB_TOKEN="ghp_..."
GEMINI_API_KEY="..."
GEMINI_MODEL="gemini-2.0-flash"
```

## Demo video

- Placeholder: _(add Loom/Drive link here)_

