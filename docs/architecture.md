# Medinexa AI — System Architecture & Technical Specification

## 1. System Overview & Architectural Objectives

Medinexa AI is a modular digital health platform engineered to bridge acute first-aid triage, emergency facility discovery, verified doctor appointments, and telehealth consultation triage. The system is designed with a strict **Safety-First Principle**: automated AI screening must never replace qualified emergency responders or make unverified clinical diagnoses.

### Key Architectural Tenets
1. **Deterministic Safety Primacy**: Life-threatening symptoms immediately trigger emergency response protocols (**Bangladesh 999** dispatch instructions) and bypass probabilistic AI inference.
2. **Decoupled Client-Server Modularity**: A high-performance Next.js 15 App Router frontend communicates via typed REST APIs with an asynchronous FastAPI backend.
3. **Strict Role Isolation (RBAC)**: Enforced authorization barriers between Patients/Users, Doctors, and Platform Administrators.
4. **Data Integrity & Concurrency**: Atomic slot conflict validation prevents double-booking for physician appointments.
5. **Geospatial Precision**: Geodesic distance sorting using the Haversine formula for nearby healthcare facility discovery.

---

## 2. System Architecture Diagram

```mermaid
graph TD
    subgraph ClientLayer ["Client Presentation Layer (Next.js 15 + React 19)"]
        UI_Home["Landing & Hero Portal<br/>(HeroVideoPortal, FannedArc)"]
        UI_Scan["Injury Studio<br/>(Web Speech API, Photo Upload)"]
        UI_Radar["Care Radar & Map<br/>(2D Spatial Projection, Haversine)"]
        UI_Chat["Telehealth Chatbot<br/>(Triage Assistant Orb)"]
        UI_Dash["Role-Based Portals<br/>(User, Doctor Desk, Admin Suite)"]
    end

    subgraph APILayer ["API & Business Logic Layer (FastAPI Async)"]
        MW_CORS["CORS & Security Headers Middleware"]
        AUTH_SVC["Auth & JWT Token Service<br/>(bcrypt, HS256 access/refresh)"]
        TRIAGE_SVC["Clinical Triage Engine<br/>(Deterministic Red-Flag Filter)"]
        GEO_SVC["Hospital Geolocation Service<br/>(Haversine Distance Engine)"]
        APPT_SVC["Appointment Conflict Engine<br/>(Atomic Overlap Guard)"]
        ADMIN_SVC["Audit Trail & RBAC Verifier"]
    end

    subgraph AIService ["AI & Clinical Safety Hub"]
        RED_FLAGS["Emergency Red-Flag Rules<br/>(16 Acute Trigger Categories)"]
        VISION_PROTO["Vision Assessment Prototype<br/>(Surface Screening)"]
        SPEC_MATCH["Specialty Recommender<br/>(Keyword-to-Department Matcher)"]
    end

    subgraph DataLayer ["Data Persistence & Storage"]
        DB_SQLITE[("SQLite / PostgreSQL<br/>SQLAlchemy 2.0 Async")]
        FS_STORAGE[("Local Storage / Volumes<br/>/storage/uploads/")]
    end

    %% Flow Connections
    ClientLayer -->|"HTTP / REST API (JWT Bearer)"| APILayer
    APILayer -->|"Triage Evaluation"| AIService
    APILayer -->|"Async Query / Commit"| DB_SQLITE
    APILayer -->|"Sanitized Image Write"| FS_STORAGE
    AIService -.->|"Deterministic Override"| APILayer
```

---

## 3. Layered Architectural Decomposition

### 3.1 Client Presentation Layer (`frontend/`)
The frontend is built on **Next.js 15.5.0** and **React 19.1.0** utilizing the App Router architecture:
- **Client Providers (`frontend/src/components/ui/ClientProviders.jsx`)**: Envelops the application with global state contexts (`AuthProvider`, `LocationProvider`) and notification toast handlers (`react-hot-toast`).
- **Authentication Context (`frontend/src/context/AuthContext.jsx`)**:
  - Handles JWT access/refresh token persistence in browser `localStorage`.
  - Automatically recovers active user sessions on mount via `/api/v1/auth/me`.
  - Integrates an Axios response interceptor that transparently requests new access tokens via `/api/v1/auth/refresh` upon encountering HTTP 401 Unauthorized responses.
- **Location Context (`frontend/src/context/LocationContext.jsx`)**:
  - Leverages browser `navigator.geolocation` for real-time latitude/longitude coordinates.
  - Automatically falls back to Dhaka metropolitan coordinates (`23.8103° N, 90.4125° E`) when location permissions are denied.
- **Component Hierarchy**:
  - `HeroVideoPortal.jsx` & `FannedFeatureArc.jsx`: Responsive landing page visualization.
  - `InjuryScanner.jsx`: Multimodal intake supporting speech dictation (Web Speech API) and image attachments.
  - `SpatialCareRadar.jsx`: 2D spatial coordinate mapping of hospitals based on bounding latitude/longitude boundaries.
  - `TriageChatbot.jsx`: Streaming-like conversational chat interface with medical red-flag detection.
  - `DoctorWorkspace.jsx`, `AdminWorkspace.jsx`, `DashboardWorkspace.jsx`: Role-segregated management dashboards.

### 3.2 Backend Service Layer (`backend/app/`)
The backend is structured around **FastAPI** with asynchronous request processing:
- **Application Lifespan (`lifespan` in `app/main.py`)**: Automatically initializes database schemas and tables on server startup.
- **Dependency Injection**:
  - `get_db`: Yields an `AsyncSession` per request and ensures proper resource disposal.
  - `get_current_user_id`: Enforces HTTP Bearer JWT authentication, extracts the user `sub`, and rejects invalid or expired tokens.
  - `require_admin`: Server-side authorization check verifying that `user.role == 'admin'`.

### 3.3 Clinical Triage & AI Layer (`ml/` & `backend/app/services/`)
- **Emergency Filter**: Checks symptom descriptions against **16 acute emergency categories**:
  - Uncontrolled hemorrhage / arterial bleeding
  - Cardiac distress / crushing chest pain
  - Stroke indicators (facial drooping, slurred speech, acute paralysis)
  - Loss of consciousness / coma / convulsions / seizures
  - Airway obstruction / respiratory failure
  - Poisoning / severe overdose / anaphylaxis
- **Urgent Filter**: Evaluates 9 urgent clinical indicators (suspected fractures, deep lacerations, sustained high fevers > 39°C) and recommends clinical consultation within 6–12 hours.
- **Vision Prototype (`ml/injury_assessment/model.py`)**: Demonstrates multimodal screening capability with clear disclosure that visual analysis is a prototype not yet clinically validated.

---

## 4. Database Architecture & Entity Relationships

The data model is implemented using **SQLAlchemy 2.0 Async ORM** targeting SQLite (`sqlite+aiosqlite`) for local development and extensible to PostgreSQL.

```mermaid
erDiagram
    User ||--o| DoctorProfile : "has"
    User ||--o{ Appointment : "books as patient"
    User ||--o{ InjuryAssessment : "submits"
    User ||--o{ ChatMessage : "sends"
    User ||--o{ Notification : "receives"
    
    Specialty ||--o{ DoctorProfile : "classifies"
    Hospital ||--o{ DoctorProfile : "employs"
    
    DoctorProfile ||--o{ DoctorAvailability : "defines"
    DoctorProfile ||--o{ Appointment : "receives"

    User {
        int id PK
        string email UK
        string password_hash
        string full_name
        string phone
        string role "user, doctor, admin"
        string country
        boolean is_active
        boolean is_demo
        datetime created_at
    }

    DoctorProfile {
        int id PK
        int user_id FK, UK
        int specialty_id FK
        int hospital_id FK
        text qualifications
        int experience_years
        string consultation_modes
        float consultation_fee
        boolean is_verified
        string verification_status
    }

    DoctorAvailability {
        int id PK
        int doctor_id FK
        int day_of_week "0-6"
        string start_time
        string end_time
        boolean is_available
        int slot_duration_minutes
    }

    Hospital {
        int id PK
        string name
        string address
        string city
        float latitude
        float longitude
        string phone
        string facility_type "government, private"
        text specialties
        boolean emergency_services
        int bed_count
        boolean is_demo
    }

    Appointment {
        int id PK
        int patient_id FK
        int doctor_id FK
        datetime date_time
        datetime end_time
        string consultation_type "in_person, telehealth"
        string status "requested, confirmed, cancelled, completed"
        string reason
        text notes
        boolean is_demo
    }

    InjuryAssessment {
        int id PK
        int user_id FK
        text description
        string image_path
        string urgency "emergency, urgent, non_urgent"
        text ai_response
        text observations
        text limitations
        text first_aid
        text warning_signs
        boolean is_demo
    }

    ChatMessage {
        int id PK
        int user_id FK
        string session_id
        string role "user, assistant"
        text content
        datetime created_at
    }

    Notification {
        int id PK
        int user_id FK
        string title
        text message
        string type
        boolean is_read
        datetime created_at
    }

    AuditLog {
        int id PK
        int user_id FK
        string action
        text details
        string ip_address
        datetime created_at
    }
```

---

## 5. Key Interaction Sequences

### 5.1 Multimodal Injury Triage Flow
```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant UI as Next.js Injury Scanner
    participant API as FastAPI Assessments Router
    participant Triage as Clinical Triage Service
    participant DB as SQLite Database
    participant FS as Storage Volume

    Patient->>UI: Input symptom text + optional image
    UI->>UI: Validate file type (JPEG, PNG, WebP) & size (< 5MB)
    UI->>API: POST /api/v1/assessments/ (Multipart Form Data)
    API->>API: Verify JWT Bearer Token
    alt Image Uploaded
        API->>FS: Save file as /storage/uploads/<uuid>.<ext>
    end
    API->>Triage: assess(description, has_image)
    Triage->>Triage: Scan for 16 Emergency Red-Flag keywords
    alt Red-Flag Detected
        Triage-->>API: Urgency: EMERGENCY (Dispatch 999 protocols)
    else Urgent Keywords Detected
        Triage-->>API: Urgency: URGENT (First-Aid + Prompt Clinic Referral)
    else Routine / Minor
        Triage-->>API: Urgency: NON_URGENT (Supportive Home Care + Monitoring)
    end
    API->>DB: INSERT into injury_assessments
    DB-->>API: Assessment ID & Timestamp
    API-->>UI: 200 OK (AssessmentResponse JSON)
    UI->>Patient: Render Severity Gauge, First-Aid Checklist & Emergency Banner
```

### 5.2 Atomic Appointment Booking with Collision Prevention
```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant UI as Next.js Care Radar / Doctor Page
    participant API as FastAPI Appointments Router
    participant DB as SQLite Database

    Patient->>UI: Select Doctor, Slot Date & Time
    UI->>API: POST /api/v1/appointments/ (doctor_id, date_time, consultation_type)
    API->>API: Authenticate User Session (get_current_user_id)
    API->>DB: SELECT doctor_id FROM doctor_profiles WHERE id = :id
    DB-->>API: Doctor verified
    API->>API: Calculate end_time = date_time + 30 minutes
    API->>DB: SELECT id FROM appointments WHERE doctor_id = :id AND status IN ('requested', 'confirmed') AND date_time < :end_time AND end_time > :date_time
    alt Time Overlap Exists
        DB-->>API: Existing conflicting record found
        API-->>UI: 409 Conflict ("This time slot is already booked")
        UI->>Patient: Alert: Slot unavailable. Select alternate time.
    else No Overlap
        DB-->>API: Empty result set
        API->>DB: INSERT into appointments (status = 'requested')
        API->>DB: INSERT into notifications (doctor notification)
        DB-->>API: Commit Transaction
        API-->>UI: 200 OK (AppointmentResponse JSON)
        UI->>Patient: Display Booking Confirmation & Queue Tracking
    end
```

---

## 6. Security & Healthcare Compliance

| Security Dimension | Mechanism Implemented | Audit Status |
|---|---|---|
| **Authentication** | JSON Web Tokens (`HS256`), access token (30 min) + refresh token (7 days) | Verified |
| **Password Hashing** | One-way `bcrypt` salting and hashing (`bcrypt.hashpw`) | Verified |
| **Role-Based Guards** | Server-side dependency `require_admin` on all `/admin/*` operations | Verified |
| **Schedule Integrity** | Mathematical overlap check (`start1 < end2 AND end1 > start2`) | Verified |
| **Input Sanitization** | Pydantic v2 validation models on all incoming payloads | Verified |
| **Upload Constraints** | Restricted MIME types (`image/jpeg`, `image/png`, `image/webp`), 5MB cap | Verified |
| **Clinical Transparency** | Explicit disclaimer banners, non-clinical tags, and emergency 999 overrides | Verified |
| **Audit Trail** | System-wide audit log table tracking administrative actions | Verified |
