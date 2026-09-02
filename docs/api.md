# PAIMANA Predict — REST API Specification (v1)

## Base URL
- **Local Development**: `http://localhost:3000/api/v1`
- **Render Production**: `https://<service-name>.onrender.com/api/v1`

---

## 1. Authentication & RBAC Endpoints

### `POST /api/v1/auth/login`
Authenticates a user by username and password.

**Request Body:**
```json
{
  "username": "officer",
  "password": "officer123"
}
```

**Response `200 OK`:**
```json
{
  "token": "paimana_token_usr-officer-01_1788342...",
  "user": {
    "id": "usr-officer-01",
    "username": "officer",
    "fullName": "Priya Iyer",
    "email": "priya.monitoring@mospi.gov.in",
    "role": "MONITORING_OFFICER",
    "department": "MoSPI Project Monitoring Division",
    "designation": "Joint Director (Surveillance)",
    "permissions": ["view:portfolio", "investigate:projects", "view:risks", "review:warnings", "assign:interventions", "generate:briefs"]
  }
}
```

### `GET /api/v1/auth/me`
Returns current authenticated user session and permissions. (Requires `Authorization: Bearer <token>`).

### `POST /api/v1/auth/logout`
Terminates the active session and logs audit event `USER_LOGOUT`.

### `GET /api/v1/auth/roles`
Returns all 5 system roles and their permission assignments.

---

## 2. Health & Surveillance Endpoints

### `GET /api/v1/health`
Returns system uptime, environment, and database connectivity.

### `GET /api/v1/health/data`
Returns dataset provenance, total projects (1,981), snapshot depth (10), and reconciliation status (`PASS`).

### `GET /api/v1/health/ml`
Returns status of the machine learning inference engine and model registry.

---

## 3. Project Master & Dynamic Updates

### `GET /api/v1/projects`
List projects with filtering, full-text search, multi-column sorting, and pagination.

### `GET /api/v1/projects/:id`
Fetch complete structured profile for a project, including multi-snapshot history.

### `GET /api/v1/projects/:id/history`
Fetch chronological time series snapshots for the project across the 10 monthly reporting periods (`2025-10` to `2026-07`).

### `POST /api/v1/projects/:id/update`
*(Requires Role: `PROJECT_ADMIN` or Permission: `update:progress`)*
Updates project physical progress %, expenditure, and target completion date. Automatically triggers dynamic risk recalculation, creates an audit event, and broadcasts a notification.

**Request Body:**
```json
{
  "physical_progress": 85.0,
  "cumulative_expenditure": 48000.0,
  "target_completion_date": "03/2027"
}
```

---

## 4. Dynamic Actions & Interventions

### `GET /api/v1/actions`
List all assigned actions with filtering by `projectId`, `status`, or `assignedRole`.

### `POST /api/v1/actions/assign`
*(Requires Role: `MONITORING_OFFICER` or Permission: `assign:interventions`)*
Assign an administrative action to a Project Administrator.

**Request Body:**
```json
{
  "projectId": "PAI-706775",
  "title": "Establish Special Taskforce for GP Fiber Handover",
  "assignedTo": "Amitabh Verma (Chief PGM)",
  "assignedRole": "PROJECT_ADMIN",
  "priority": "CRITICAL",
  "targetCompletionDate": "2026-11-30",
  "initialNotes": "Coordinate with state telecom departments."
}
```

### `PATCH /api/v1/actions/:id/status`
*(Requires Permission: `update:actions`)*
Update the action lifecycle state (`IN_PROGRESS`, `EVIDENCE_SUBMITTED`, `RESOLVED`) with progress notes and evidence URLs.

---

## 5. Security & Domain Audit Trail

### `GET /api/v1/audit`
*(Requires Role: `SYSTEM_ADMIN` or Permission: `inspect:audit`)*
Inspect security audit logs (`USER_LOGIN`, `PROJECT_UPDATED`, `ACTION_ASSIGNED`, `INGESTION_COMPLETED`).

---

## 6. Role-Aware Notifications

### `GET /api/v1/notifications`
Fetch notifications targeted to the user's role.

### `PATCH /api/v1/notifications/:id/read`
Mark a notification as read.

---

## 7. Portfolio & Machine Learning

### `GET /api/v1/portfolio/summary`
Returns macro financial totals (Original: ₹37.12L Cr, Revised: ₹42.78L Cr, Exp: ₹20.36L Cr), sector aggregations, and top cost escalations.

### `GET /api/v1/predictions/models`
Returns cross-validated model benchmarks comparing Gradient Boosting (0.916 ROC-AUC) vs baseline models.

### `POST /api/v1/assistant/query`
Grounded natural language query engine.
