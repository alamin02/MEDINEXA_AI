# Medinexa AI — Deployment Guide

## Prerequisites
- Docker Engine 24+ & Docker Compose v2+ OR
- Python 3.10+ and Node.js 18+

## Local Quickstart (Bare Metal)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python scripts/seed.py
uvicorn app.main:app --reload --port 8000
```
Backend API and Swagger UI will be running at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
# Windows PowerShell: Copy-Item .env.example .env.local
# Linux/macOS:
cp .env.example .env.local
npm run dev
```
Frontend web application will be live at `http://localhost:3000`. The default API URL is `http://localhost:8000/api/v1`; set `NEXT_PUBLIC_API_URL` in `.env.local` if the backend runs elsewhere.

---

## Docker Compose Quickstart (Single Command)
To run the full stack (FastAPI Backend + React Frontend + Seeded SQLite):
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`

---

## Vercel Deployment

Deploy the backend and frontend as **two separate Vercel projects** from this repository.
API keys do not deploy the backend; each project needs the correct root directory and build
configuration.

### 1. Backend project

- Set **Root Directory** to `backend`.
- Add these Environment Variables in Vercel (Production, and Preview if needed):
  - `SECRET_KEY`: a long, random value used to sign authentication tokens.
  - `CORS_ORIGINS`: the exact deployed frontend origin, e.g.
    `https://your-frontend.vercel.app` (comma-separate multiple origins).
  - `DATABASE_URL`: recommended, a PostgreSQL connection URL from a hosted database.
    `postgres://` and `postgresql://` URLs are supported.
  - `DEMO_MODE`: `true` for demo behavior or `false` for production behavior.
  - `GOOGLE_MAPS_API_KEY`: optional; only needed if enabling Google Maps integration.
- Redeploy after changing variables.

The backend's `api/index.py` and `vercel.json` expose the FastAPI application as a Vercel
Function. Without `DATABASE_URL`, it uses SQLite under `/tmp` so the function can start,
but that database is temporary and isolated per serverless instance. Do not use this fallback
for persistent or production data.

The backend's Vercel URL serves the API at `/api/v1` and Swagger at `/docs`.

### 2. Frontend project

- Create a second Vercel project from the same repository and set **Root Directory** to
  `frontend`.
- Set `NEXT_PUBLIC_API_URL` to the backend URL followed by `/api/v1`, for example
  `https://your-backend.vercel.app/api/v1`.
- Redeploy after setting the variable. `NEXT_PUBLIC_API_URL` is embedded during the frontend
  build; backend API keys must not be added to `NEXT_PUBLIC_*` variables.

If frontend requests fail in the browser, verify that `CORS_ORIGINS` on the backend exactly
matches the frontend's deployed origin (scheme and hostname, without a trailing slash).
