# CampusConnect: Scaling Communities through Data-Driven Advocacy

CampusConnect is a centralized **Campus Ambassador Management Platform** with an integrated **AI GitHub Auditor**.
It moves CA programs from spreadsheets to an ROI-positive engine with a recruiter-ready developer growth loop.

## Architecture (Decoupled Microservices)

- **Frontend**: Next.js (App Router) + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (Python) for high-speed processing
- **Database**: MongoDB (tasks, users, leaderboard)
- **AI Engine**: Gemini (GitHub profile + repo analysis → recruiter feedback)

## What you can do

- **GitHub Pulse**: Fetch GitHub data and generate a 1–100 Recruiter-Ready Score + actionable tips
- **Smart Task Workflow**: Auto-generated growth tasks with status tracking
- **Leaderboard**: Rank ambassadors by GitHub strength + task completion
- **Premium UX**: Dark, high-contrast UI (Slate/Cyan) with micro-interactions

## Repo structure

- `apps/web`: Next.js frontend
- `services/api`: FastAPI backend

## Local development

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

### Backend

```bash
cd services/api
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Environment variables

Create **local** `.env` files (they are gitignored):

- `apps/web/.env.local`
- `services/api/.env`

Backend expected keys (example):

```bash
MONGODB_URI="mongodb+srv://..."
GITHUB_TOKEN="ghp_..."
GEMINI_API_KEY="..."
```


