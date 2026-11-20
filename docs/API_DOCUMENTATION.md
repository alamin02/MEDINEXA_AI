# Medinexa AI — REST API Documentation

**API Version**: 1.0.0  
**Base URL**: `http://localhost:8000/api/v1`  
**Interactive Swagger UI**: `http://localhost:8000/docs`  
**ReDoc Specification**: `http://localhost:8000/redoc`  

All requests and responses use the `application/json` MIME type unless specified otherwise (e.g., multipart/form-data for image uploads).

---

## Authentication & Authorization Header

Protected endpoints require a valid JWT Bearer access token passed via the HTTP `Authorization` header:

```http
Authorization: Bearer <your_access_token>
```

Tokens are obtained by logging in via `POST /api/v1/auth/login` or registering via `POST /api/v1/auth/register`. Access tokens expire in 30 minutes; refresh tokens expire in 7 days.

---

## 1. Health & System Status

### `GET /health/`
Performs a lightweight system availability and readiness check.

- **Authentication**: None (Public)
- **Response** `200 OK`:
```json
{
  "status": "healthy",
  "service": "Medinexa AI Backend",
  "version": "1.0.0",
  "demo_mode": true
}
```

---

## 2. Authentication (`/auth`)

### `POST /auth/register`
Creates a new patient or physician account.

- **Authentication**: None (Public)
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "Rahim Ahmed",
  "phone": "+8801700000000",
  "role": "user",
  "country": "BD"
}
```
- **Response** `200 OK`:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Rahim Ahmed",
    "phone": "+8801700000000",
    "role": "user",
    "country": "BD",
    "language": "en",
    "avatar_url": null,
    "is_active": true,
    "created_at": "2026-11-20T10:00:00Z"
  }
}
```
- **Error Codes**: `400 Bad Request` (Email already registered or validation error).

---

### `POST /auth/login`
Authenticates existing credentials and issues JWT token pair.

- **Authentication**: None (Public)
- **Request Body**:
```json
{
  "email": "user@medinexa.ai",
  "password": "User123!"
}
```
- **Response** `200 OK`: Returns `TokenResponse` with `access_token`, `refresh_token`, and user profile object.
- **Error Codes**: `401 Unauthorized` (Invalid credentials), `403 Forbidden` (Account suspended).

---

### `POST /auth/refresh`
Rotates and issues a new access token using a valid refresh token.

- **Authentication**: None (Requires valid refresh token in payload)
- **Request Body**:
```json
{
  "refresh_token": "eyJhbGciOi..."
}
```
- **Response** `200 OK`: Returns new `TokenResponse`.
- **Error Codes**: `401 Unauthorized` (Token invalid, expired, or wrong type).

---

### `GET /auth/me`
Retrieves currently authenticated session user details.

- **Authentication**: Required (`Bearer`)
- **Response** `200 OK`: Returns `UserResponse`.

---

## 3. Users (`/users`)

### `GET /users/profile`
Retrieves the logged-in user's profile.

- **Authentication**: Required (`Bearer`)
- **Response** `200 OK`: Returns `UserResponse`.

---

### `PUT /users/profile`
Updates personal profile attributes.

- **Authentication**: Required (`Bearer`)
- **Request Body**:
```json
{
  "full_name": "Rahim Khan Updated",
  "phone": "+8801712345678",
  "country": "BD",
  "language": "en"
}
```
- **Response** `200 OK`: Returns updated `UserResponse`.

---

### `GET /users/dashboard`
Fetches aggregate metric counters for the patient dashboard.

- **Authentication**: Required (`Bearer`)
- **Response** `200 OK`:
```json
{
  "upcoming_appointments": 2,
  "total_assessments": 4,
  "saved_hospitals": 0,
  "unread_notifications": 1
}
```

---

## 4. Doctors (`/doctors`)

### `GET /doctors/specialties`
Returns all registered clinical medical specialties.

- **Authentication**: None (Public)
- **Response** `200 OK`:
```json
[
  {
    "id": 1,
    "name": "Cardiology",
    "description": "Heart and cardiovascular system",
    "icon": "heart"
  }
]
```

---

### `GET /doctors/`
Searches verified doctors with optional filtering parameters.

- **Authentication**: None (Public)
- **Query Parameters**:
  - `specialty` *(string, optional)*: Filter by specialty name (e.g. `Cardiology`).
  - `city` *(string, optional)*: Filter by associated hospital city.
  - `consultation_type` *(string, optional)*: `in_person` or `telehealth`.
  - `search` *(string, optional)*: Name search string.
- **Response** `200 OK`: Array of `DoctorProfileResponse` objects.

---

### `GET /doctors/{doctor_id}`
Retrieves detailed credentials and profile for a specific doctor.

- **Authentication**: None (Public)
- **Response** `200 OK`: Returns `DoctorProfileResponse`.
- **Error Codes**: `404 Not Found`.

---

### `GET /doctors/{doctor_id}/availability`
Fetches weekly availability schedules and slot durations for a doctor.

- **Authentication**: None (Public)
- **Response** `200 OK`:
```json
[
  {
    "id": 1,
    "doctor_id": 2,
    "day_of_week": 0,
    "start_time": "09:00",
    "end_time": "17:00",
    "is_available": true,
    "slot_duration_minutes": 30
  }
]
```

---

### `PUT /doctors/profile`
Allows a doctor to update their clinical bio, fee, qualifications, and hospital affiliation.

- **Authentication**: Required (Doctor role)
- **Request Body**:
```json
{
  "qualifications": "MBBS, FCPS (Medicine)",
  "experience_years": 8,
  "consultation_fee": 1200.0,
  "languages": "English, Bengali",
  "consultation_modes": "in_person,telehealth",
  "bio": "Consultant Physician with focus on preventative care.",
  "specialty_id": 1,
  "hospital_id": 1
}
```

---

### `PUT /doctors/availability`
Updates or creates availability schedule entries for a doctor.

- **Authentication**: Required (Doctor role)
- **Request Body**:
```json
{
  "day_of_week": 1,
  "start_time": "10:00",
  "end_time": "18:00",
  "is_available": true,
  "slot_duration_minutes": 30
}
```

---

### `GET /doctors/appointments/list`
Retrieves the incoming patient appointment queue for the logged-in doctor.

- **Authentication**: Required (Doctor role)
- **Query Parameters**: `status` *(string, optional)*: Filter by `requested`, `confirmed`, etc.
- **Response** `200 OK`: List of `AppointmentResponse`.

---

### `PUT /doctors/appointments/{appointment_id}/status`
Allows a doctor to accept (`confirmed`), reject (`rejected`), or complete (`completed`) an appointment.

- **Authentication**: Required (Doctor role)
- **Request Body**:
```json
{
  "status": "confirmed",
  "notes": "Patient requested consultation at Dhaka chamber."
}
```

---

## 5. Hospitals (`/hospitals`)

### `GET /hospitals/`
Searches medical facilities with optional geodesic distance calculations using the Haversine formula.

- **Authentication**: None (Public)
- **Query Parameters**:
  - `city` *(string, optional)*: Filter by city (e.g., `Dhaka`, `Chittagong`).
  - `facility_type` *(string, optional)*: `government` or `private`.
  - `specialty` *(string, optional)*: Specialty keyword.
  - `lat` *(float, optional)*: User current latitude.
  - `lng` *(float, optional)*: User current longitude.
  - `max_distance` *(float, default: 50.0)*: Maximum search radius in kilometers.
  - `search` *(string, optional)*: Hospital name or address keyword.
- **Response** `200 OK`:
```json
[
  {
    "id": 1,
    "name": "Dhaka Medical College Hospital",
    "address": "Secretariat Rd, Dhaka 1000",
    "city": "Dhaka",
    "latitude": 23.7266,
    "longitude": 90.3977,
    "phone": "+880-2-55165088",
    "email": null,
    "website": null,
    "facility_type": "government",
    "specialties": "General Medicine, Cardiology, Emergency Care, Surgery",
    "departments": "Emergency, ICU, CCU, Burn Unit",
    "emergency_services": true,
    "bed_count": 2600,
    "is_active": true,
    "is_demo": true,
    "source": "Demo Data",
    "distance_km": 9.4
  }
]
```

---

### `GET /hospitals/{hospital_id}`
Returns details for a specific hospital facility.

- **Authentication**: None (Public)
- **Response** `200 OK`: Returns `HospitalResponse`.

---

## 6. Appointments (`/appointments`)

### `POST /appointments/`
Books an appointment slot. Enforces atomic double-booking collision checks.

- **Authentication**: Required (`Bearer`)
- **Request Body**:
```json
{
  "doctor_id": 2,
  "date_time": "2026-11-25T10:00:00Z",
  "consultation_type": "in_person",
  "reason": "Routine cardiac checkup"
}
```
- **Response** `200 OK`: Returns `AppointmentResponse`.
- **Error Codes**: `404 Not Found` (Doctor does not exist), `409 Conflict` ("This time slot is already booked").

---

### `GET /appointments/`
Returns the logged-in patient's booking history.

- **Authentication**: Required (`Bearer`)
- **Query Parameters**: `status` *(string, optional)*: Filter by appointment status.
- **Response** `200 OK`: List of `AppointmentResponse`.

---

### `PUT /appointments/{appointment_id}/cancel`
Cancels an active or pending consultation.

- **Authentication**: Required (`Bearer`)
- **Response** `200 OK`: `{"message": "Appointment cancelled"}`.
- **Error Codes**: `400 Bad Request` (Cannot cancel completed appointments).

---

## 7. Assessments (`/assessments`)

### `POST /assessments/`
Submits symptoms and optional injury photograph for clinical safety triage.

- **Authentication**: Required (`Bearer`)
- **Request Format**: `multipart/form-data`
  - `description` *(text, min 5 chars, required)*: Detailed description of injury or symptoms.
  - `image` *(file, optional)*: Image file (JPEG, PNG, WebP; max 5MB).
- **Response** `200 OK`:
```json
{
  "id": 1,
  "user_id": 3,
  "description": "Small cut on finger, minor bleeding",
  "image_path": "a8f7c9e123...jpg",
  "urgency": "non_urgent",
  "ai_response": "ℹ️ Non-urgent — Self-care with monitoring...",
  "observations": "Based on the description provided, does not show immediate emergency signs.",
  "limitations": "This automated system provides general educational information only.",
  "next_steps": "1. Follow basic first aid guidance\n2. Monitor symptoms over 24-48 hours",
  "first_aid": "1. Wash hands\n2. Clean cut under running water\n3. Apply pressure with clean cloth",
  "warning_signs": "Seek care if bleeding won't stop or wound shows redness/warmth/pus.",
  "model_version": "demo-v1.0",
  "is_demo": true,
  "created_at": "2026-11-20T10:30:00Z"
}
```
- **Emergency Response Override**: If the description contains any of the 16 red-flag triggers (e.g. "chest pain", "severe bleeding"), the endpoint returns `urgency: "emergency"` with prominent instructions to dial **999**.

---

### `GET /assessments/`
Retrieves past triage assessment history for the current user.

- **Authentication**: Required (`Bearer`)
- **Response** `200 OK`: List of `AssessmentResponse`.

---

### `DELETE /assessments/{assessment_id}`
Deletes an assessment and purges associated image files from disk storage.

- **Authentication**: Required (`Bearer`)
- **Response** `200 OK`: `{"message": "Assessment deleted"}`.

---

## 8. Telehealth Assistant (`/telehealth`)

### `POST /telehealth/chat`
Conversational symptom triage assistant with red-flag detection and doctor recommendation.

- **Authentication**: Required (`Bearer`)
- **Request Body**:
```json
{
  "message": "I've been feeling heart palpitations and mild dizziness",
  "session_id": "optional-uuid"
}
```
- **Response** `200 OK`:
```json
{
  "reply": "Based on your symptoms, I recommend consulting with a Cardiology specialist...",
  "session_id": "3c914e7a-...",
  "suggested_doctors": [
    {
      "id": 2,
      "full_name": "Dr. Sarah Ahmed",
      "specialty": { "id": 2, "name": "Cardiology" },
      "hospital_name": "National Institute of Cardiovascular Diseases"
    }
  ],
  "is_emergency": false,
  "emergency_message": null
}
```

---

### `GET /telehealth/chat/history`
Retrieves chat transcripts for an active session.

- **Authentication**: Required (`Bearer`)
- **Query Parameters**: `session_id` *(string, required)*.
- **Response** `200 OK`: Array of message objects with `role` and `content`.

---

## 9. Notifications (`/notifications`)

### `GET /notifications/`
Fetches in-app notifications (appointment updates, verification alerts).

- **Authentication**: Required (`Bearer`)
- **Response** `200 OK`: List of `NotificationResponse`.

---

### `PUT /notifications/{notification_id}/read`
Marks a specific notification as read.

- **Authentication**: Required (`Bearer`)
- **Response** `200 OK`: `{"message": "Marked as read"}`.

---

### `PUT /notifications/read-all`
Marks all pending unread notifications as read.

- **Authentication**: Required (`Bearer`)
- **Response** `200 OK`: `{"message": "All notifications marked as read"}`.

---

## 10. Admin Management (`/admin`)

*All `/admin/*` endpoints strictly require an authenticated user with `role="admin"`.*

| Endpoint | Method | Purpose |
|---|---|---|
| `/admin/dashboard` | `GET` | Aggregated statistics (total users, verified doctors, appointments, hospitals). |
| `/admin/users` | `GET` | Paginated user directory with role and status filtering. |
| `/admin/users/{uid}/status` | `PUT` | Suspend or reactivate a user account (`{"is_active": false}`). |
| `/admin/doctors/pending` | `GET` | Applications from doctors awaiting credential approval. |
| `/admin/doctors/{doctor_id}/verify` | `PUT` | Approve or reject credentials (`{"status": "approved", "notes": "Verified BMDC license"}`). |
| `/admin/hospitals` | `GET` | List all hospitals for administrative review. |
| `/admin/hospitals` | `POST` | Create a new hospital facility in the directory. |
| `/admin/hospitals/{hospital_id}` | `PUT` | Update existing facility details or emergency service status. |
| `/admin/appointments` | `GET` | Global audit list of all platform appointments. |
| `/admin/audit-logs` | `GET` | Immutable system audit log trail. |
