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
npm run dev
```
Frontend web application will be live at `http://localhost:5173`.

---

## Docker Compose Quickstart (Single Command)
To run the full stack (FastAPI Backend + React Frontend + Seeded SQLite):
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`
