# Medinexa AI — Comprehensive Project Scan, Technical Audit & Security Review

**Audit Date**: November 2026  
**Auditor**: Senior Software Architect, AI/ML Safety Engineer & Cybersecurity Reviewer  
**Repository**: [MEDINEXA_AI](https://github.com/alamin02/MEDINEXA_AI.git)  
**Target Environment**: Windows / Linux / Docker  
**Status**: Technical Audit & Verified Assessment Complete  

---

## 1. Executive Summary

A comprehensive architectural scan, source code audit, and security review was conducted on the **Medinexa AI** project repository. The application is a full-stack digital health navigation platform built to provide automated preliminary injury triage, emergency facility discovery in Bangladesh, verified doctor appointments, and telehealth consultation triage.

### Summary of Repository Metrics
| Metric | Findings |
|---|---|
| **Architecture** | Decoupled Client-Server (Next.js 15 App Router Frontend + FastAPI Async Backend) |
| **Primary Languages** | Python 3.11+, JavaScript (ESNext / JSX), SQL |
| **Database Engine** | SQLite (via `aiosqlite` and `SQLAlchemy 2.0` Async ORM) |
| **Authentication** | JWT (`python-jose` with `HS256`), Passwords hashed with `bcrypt` |
| **Frontend Framework** | Next.js 15.5.0, React 19.1.0, Tailwind CSS 3.4.17, DaisyUI 4.12.24 |
| **AI/ML Engine** | Deterministic Keyword Safety Rules + Rule-based Urgency Scoring + Prototype Vision Model |
| **Containerization** | Multi-stage Dockerfiles (`frontend/Dockerfile`, `backend/Dockerfile`) + `docker-compose.yml` |
| **Test Suites** | `backend/tests/test_api.py` (FastAPI TestClient), `ml/tests/test_ml.py` (Pytest) |
| **Demo Data Isolation** | Seed script tags all mock records with `is_demo=True` |

---

## 2. Source Code & Architecture Inspection Findings

### 2.1 Backend Implementation (`backend/app/`)
- **Framework**: FastAPI with async route handlers and SQLAlchemy 2.0 `AsyncSession`.
- **Database Lifespan**: Database tables are initialized asynchronously on startup via `@asynccontextmanager` in `app/main.py`.
- **Routers Registered**: 10 active API routers under prefix `/api/v1`:
  - `health` (`/api/v1/health`)
  - `auth` (`/api/v1/auth`)
  - `users` (`/api/v1/users`)
  - `doctors` (`/api/v1/doctors`)
  - `admin` (`/api/v1/admin`)
  - `assessments` (`/api/v1/assessments`)
  - `hospitals` (`/api/v1/hospitals`)
  - `appointments` (`/api/v1/appointments`)
  - `telehealth` (`/api/v1/telehealth`)
  - `notifications` (`/api/v1/notifications`)
- **Appointment Conflict Guard**: Verified atomic query in `backend/app/api/appointments.py` preventing overlapping time slots for the same doctor when status is `requested` or `confirmed`.
- **Hospital Geolocation**: Implements the mathematical Haversine formula (`backend/app/api/hospitals.py`) to calculate direct geodesic distance in kilometers between user coordinates (`lat`, `lng`) and hospital coordinates.

### 2.2 Frontend Implementation (`frontend/src/`)
- **Framework**: Modern Next.js 15 App Router with React 19 and client/server component separation.
- **State & Context**:
  - `AuthContext.jsx`: Manages token storage in `localStorage`, user restoration from `/auth/me`, and automatic refresh token rotation via Axios interceptors.
  - `LocationContext.jsx` & `useGeolocation.js`: Interacts with browser `navigator.geolocation` API with fallbacks to Dhaka central coordinates (`23.8103, 90.4125`).
- **Interactive UI Modules**:
  - `SpatialCareRadar.jsx`: Dynamic 2D spatial coordinate projection plotting hospitals visually on an interactive radar matrix based on latitude/longitude boundaries.
  - `InjuryScanner.jsx`: Multimodal intake supporting text descriptions, file uploads (JPEG, PNG, WebP), and client-side speech-to-text dictation using the Web Speech API (`SpeechRecognition`).
  - `TriageChatbot.jsx`: Conversational assistant interface connecting to `/telehealth/chat` with red-flag emergency detection and voice input capability.
  - Role-based workspaces: `AdminWorkspace.jsx`, `DoctorWorkspace.jsx`, `DashboardWorkspace.jsx`.

### 2.3 AI & ML Service Inspection (`ml/` & `backend/app/services/`)
- **Triage Safety Engine (`ml/triage/engine.py` & `backend/app/services/triage.py`)**:
  - Implements deterministic matching against **16 emergency red-flag triggers** (e.g., `chest pain`, `cardiac arrest`, `unconscious`, `arterial bleeding`, `stroke`, `facial droop`, `anaphylaxis`).
  - Emergency conditions instantly return emergency protocols directing users to **Bangladesh Emergency Dispatch (999)** and nearest hospital emergency departments, completely bypassing probabilistic ML inference.
  - Urgent conditions evaluate 9 urgent triggers (fractures, deep cuts, high fever > 39°C/103°F) and provide targeted first-aid guidance.
- **Vision Model Prototype (`ml/injury_assessment/model.py`)**:
  - Returns structured observations, explicit clinical limitations, and confidence scores (0.72 with image, 0.50 without image).
  - Explicitly hardcodes `is_clinically_validated = False`.
- **Specialty Recommender (`ml/recommendation/recommender.py`)**:
  - Maps medical keywords to 7 clinical specialties (Cardiology, Dermatology, Orthopedics, Pediatrics, Ophthalmology, Neurology, ENT) with fallback to "General Medicine".

---

## 3. Feature Classification & Verification Matrix

| Feature | Location | Status | Implementation Details |
|---|---|---|---|
| **User Authentication** | `backend/app/api/auth.py`, `frontend/src/context/AuthContext.jsx` | **Verified Complete** | JWT Access (30m) & Refresh (7d) tokens, bcrypt password hashing, automatic token refresh interceptor. |
| **Role-Based Access Control** | `backend/app/api/admin.py`, `frontend/src/components/ui/ProtectedGate.jsx` | **Verified Complete** | Server-side role validation (`user`, `doctor`, `admin`) protecting sensitive endpoints. |
| **First-Aid & Triage Engine** | `backend/app/services/triage.py`, `ml/triage/engine.py` | **Verified Complete** | Deterministic keyword filtering for emergency, urgent, and non-urgent classification with 999 overrides. |
| **Hospital Directory & GPS** | `backend/app/api/hospitals.py`, `frontend/src/components/radar/SpatialCareRadar.jsx` | **Verified Complete** | Haversine distance calculations, filtering by city/specialty/facility type, 2D radar visual projection. |
| **Doctor Directory & Booking** | `backend/app/api/doctors.py`, `backend/app/api/appointments.py` | **Verified Complete** | Specialty filtering, schedule availability slots, appointment requests with double-booking prevention. |
| **Doctor Queue Management** | `backend/app/api/doctors.py`, `frontend/src/components/ui/DoctorWorkspace.jsx` | **Verified Complete** | Doctors can view appointment queue, accept/reject requests, and update consultation notes. |
| **Admin Control Suite** | `backend/app/api/admin.py`, `frontend/src/components/ui/AdminWorkspace.jsx` | **Verified Complete** | Dashboard stats, user account suspension/activation, doctor credential verification, hospital management, audit logs. |
| **Telehealth AI Assistant** | `backend/app/api/telehealth.py`, `frontend/src/components/chatbot/TriageChatbot.jsx` | **Verified Complete** | Conversational session logging, automated doctor recommendations, emergency red-flag override. |
| **Speech Dictation** | `frontend/src/components/scanner/InjuryScanner.jsx` | **Verified Complete** | Web Speech API client-side voice transcription. |
| **Notification System** | `backend/app/api/notifications.py` | **Verified Complete** | In-app notification creation, unread count tracking, mark-as-read endpoints. |
| **Image Screening Model** | `ml/injury_assessment/model.py`, `backend/app/api/assessments.py` | **Prototype / Mock** | Deterministic mock engine returning static observations and confidence scores. No neural network weights loaded. |
| **Blood Bank Module** | `frontend/src/components/radar/BloodBankInventory.jsx`, `frontend/src/app/blood-bank/page.jsx` | **Prototype / Mock** | UI placeholder explicitly stating *"Live inventory and donor requests are not available in the current backend API."* |
| **Real-time Video Telehealth** | `frontend/src/app/dashboard/` | **Planned** | UI demo entrance present; WebRTC / live video streaming infrastructure is not implemented. |
| **Live External Hospital API** | N/A | **Not Implemented** | All facilities are seeded demo records; no real-time integration with Bangladesh DGHS or hospital HMIS. |

---

## 4. Cybersecurity Audit & Observations

### 4.1 Vulnerabilities & Findings

#### Finding 1: File Upload Extension Extraction from User Filename (Medium Severity)
- **File**: [assessments.py](file:///b:/medi_nexa_ai/MEDINEXA_AI/backend/app/api/assessments.py#L32)
- **Observation**: The filename extension is determined via:
  ```python
  ext = image.filename.split(".")[-1] if image.filename else "jpg"
  filename = f"{uuid.uuid4().hex}.{ext}"
  ```
- **Risk**: Although `image.content_type in ALLOWED_TYPES` (`image/jpeg`, `image/png`, `image/webp`) is checked, if a client submits `content-type: image/jpeg` with filename `payload.php`, the file is saved as `<uuid>.php` on disk.
- **Recommendation**: Derive the file extension strictly from the verified MIME type dictionary (`{"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}`) rather than trusting the user-supplied filename.

#### Finding 2: Discrepancy Between EXIF Stripping Claim and Implementation (Low/Compliance Severity)
- **File**: `docs/architecture.md` vs `backend/app/api/assessments.py`
- **Observation**: Architecture documentation claimed that *“All uploaded injury photographs have EXIF & geolocation stripped prior to storage.”* In `assessments.py`, the raw bytes are directly written to disk (`f.write(content)`) without invoking Pillow (`PIL.Image`) to strip EXIF metadata tags.
- **Risk**: High-resolution smartphone photos might contain embedded GPS coordinates or device identifiers.
- **Recommendation**: Integrate PIL sanitization before writing:
  ```python
  from PIL import Image
  import io

  image_obj = Image.open(io.BytesIO(content))
  clean_bytes = io.BytesIO()
  image_obj.save(clean_bytes, format=image_obj.format)
  ```

#### Finding 3: Default Development Secret Key in Settings (Medium Severity for Production)
- **File**: [config.py](file:///b:/medi_nexa_ai/MEDINEXA_AI/backend/app/core/config.py#L13) and [docker-compose.yml](file:///b:/medi_nexa_ai/MEDINEXA_AI/docker-compose.yml#L13)
- **Observation**: `SECRET_KEY: str = "dev-secret-key-change-in-production"` is set as default fallback, and `docker-compose.yml` provides `SECRET_KEY=demo-secret-key-for-medinexa-hackathon-2026`.
- **Risk**: If deployed without setting the `SECRET_KEY` environment variable, JWT tokens can be forged.
- **Recommendation**: In production environments (`DEBUG=False`), fail fast if `SECRET_KEY` matches known development defaults.

#### Finding 4: Token Storage in Client LocalStorage (Low/Standard Web Pattern)
- **File**: `frontend/src/context/AuthContext.jsx` and `frontend/src/lib/api.js`
- **Observation**: JWT access and refresh tokens are stored in `window.localStorage`.
- **Risk**: Vulnerable to token extraction if an XSS vulnerability occurs in client code or third-party dependencies.
- **Recommendation**: For production, transition to `httpOnly`, `Secure`, `SameSite=Strict` cookies for storing refresh tokens.

#### Finding 5: Rate Limiting Absence on Authentication Endpoints (Low Severity)
- **File**: `backend/app/api/auth.py`
- **Observation**: The `/api/v1/auth/login` and `/api/v1/auth/register` endpoints do not have brute-force throttling or IP-based rate limiting middleware.
- **Recommendation**: Integrate `slowapi` or Redis-backed rate limiting to prevent automated credential stuffing.

### 4.2 Security Strengths Identified
- **Bcrypt Password Hashing**: Passwords are never stored in plaintext; proper salt and hash validation is enforced.
- **Role Verification Guards**: Admin and doctor endpoints enforce authorization checks at the handler level before processing data.
- **No Committed Secrets**: No live production `.env` files or real API keys are committed in Git history.
- **Clean Gitignore**: `.gitignore` comprehensively excludes `.env`, `node_modules`, `.next`, `*.db`, `storage/uploads/*`, and caches.
- **Transparent Demo Mode**: Non-production seed data is explicitly labeled with `is_demo=True` across database tables.

---

## 5. Verification Commands & Execution Status

All commands verified against actual project dependencies:

```bash
# 1. Backend Verification
cd backend
python scripts/seed.py
python -m pytest tests/ -v

# 2. ML & Triage Safety Engine Verification
python -m pytest ml/tests/ -v

# 3. Frontend Verification
cd frontend
npm run lint
npm run build
```

---

## 6. Audit Conclusion & Recommendations

The Medinexa AI codebase represents a well-engineered full-stack health-tech prototype with an exemplary emphasis on **clinical safety overrides** (deterministic 999 emergency triggers). All core CRUD workflows, role-based dashboards, appointment booking conflict protections, and geospatial hospital queries are fully functional and verifiable.

Prior to any real-world pilot or production deployment, the team should:
1. Enforce strict server-side MIME-to-extension mapping for image uploads.
2. Implement PIL-based EXIF stripping on uploaded medical photos.
3. Configure strict HTTPS, production CORS domains, and httpOnly cookie-based session tokens.
4. Replace prototype vision scoring with a clinically validated diagnostic assistance model trained on IRB-approved datasets.
