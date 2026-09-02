# PAIMANA Predict — System Architecture & Technical Specification

## 1. Executive Mission & Target Solution

**PAIMANA Predict** (Smart India Hackathon 2026, **Problem Statement 26103**) is a mission-critical infrastructure surveillance and decision-support platform designed to transform descriptive monthly project reporting from the Ministry of Statistics & Programme Implementation (MoSPI) into proactive risk intelligence, root-cause explainability, and prescriptive interventions.

### End-to-End Solution Architecture:
```
                    PAIMANA / OCMS
                         ↓
                  DATA INGESTION
                         ↓
                 DATA VALIDATION
                         ↓
              PROJECT MASTER DATA
                         ↓
               HISTORICAL SNAPSHOTS
                         ↓
                PROJECT TIMELINE
                         ↓
                 FEATURE ENGINE
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
     COST ML          TIME ML        RISK ENGINE
        └────────────────┼────────────────┘
                         ↓
               WEAK-SIGNAL DETECTION
                         ↓
               RISK PROPAGATION
                         ↓
              EXPLAINABLE ANALYSIS
                         ↓
                EARLY WARNING
                         ↓
              PRIORITY RANKING
                         ↓
          PRESCRIPTIVE RECOMMENDATION
                         ↓
               ROLE WORKSPACES
                         ↓
            ADMINISTRATIVE ACTION
                         ↓
                 PROJECT RESPONSE
                         ↓
               RISK RECALCULATION
                         ↓
                  AUDIT HISTORY
                         ↓
               MODEL IMPROVEMENT
```

---

## 2. Multi-User Architecture & Role Workspaces

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (Presentation)                              │
│  React 18 • TypeScript • Tailwind CSS • Recharts • Vite SPA • Accessible Design System │
│  ┌──────────────────┬──────────────────┬──────────────────┬─────────────────────────┐  │
│  │ Admin Workspace  │ Officer Monitor  │ Nodal Workspace  │ Analyst / ML Workspace  │  │
│  └──────────────────┴──────────────────┴──────────────────┴─────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼  HTTPS / REST JSON
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY & BACKEND ENGINE                              │
│  Node.js / Express • RBAC Middleware • Request Logger • Error Handler • Rate Limiting  │
│  ┌────────────────────────┬─────────────────────────┬───────────────────────────────┐  │
│  │ /api/v1/auth           │ /api/v1/projects        │ /api/v1/actions               │  │
│  │ /api/v1/audit          │ /api/v1/notifications   │ /api/v1/predictions           │  │
│  └────────────────────────┴─────────────────────────┴───────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
            │                               │                             │
            ▼                               ▼                             ▼
┌───────────────────────┐       ┌───────────────────────┐     ┌────────────────────────┐
│   PROJECT & HISTORY   │       │   ACTION & WORKFLOW   │     │  GROUNDED INTELLIGENCE │
│   DOMAIN SERVICE      │       │   DOMAIN SERVICE      │     │  COPILOT SERVICE       │
└───────────────────────┘       └───────────────────────┘     └────────────────────────┘
            │                               │                             │
            └───────────────────────────────┼─────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             PERSISTENCE & REPOSITORY TIER                              │
│  PostgreSQL (Relational Store) • Normalized Data Models • Multi-Snapshot Time Series   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Dynamic State Machines

### 3.1 Project Risk Lifecycle State Machine
```
ON_TRACK ──► WATCH ──► AT_RISK ──► HIGH_RISK ──► CRITICAL ──► INTERVENTION ──► RECOVERY ──► ON_TRACK
```

### 3.2 Dynamic Action & Intervention Lifecycle
```
RISK_DETECTED ──► RECOMMENDED ──► ACTION_ASSIGNED ──► IN_PROGRESS ──► EVIDENCE_SUBMITTED ──► OFFICER_REVIEW ──► RESOLVED ──► RECALCULATED
```

---

## 4. Single Source of Truth Domain Mapping

| Domain Entity | Authoritative Source | Service Layer | API Endpoint |
| :--- | :--- | :--- | :--- |
| **Authentication & RBAC** | `users` & `role_permissions` | `authService` | `POST /api/v1/auth/login` |
| **Project Master & Financials** | `projects` table | `projectService` | `GET /api/v1/projects/:id` |
| **Multi-Month Snapshots** | `project_snapshots` table | `projectService` | `GET /api/v1/projects/:id/history` |
| **Portfolio Macro Metrics** | `paimana_portfolio_summary.json` | `portfolioService` | `GET /api/v1/portfolio/summary` |
| **Dynamic Interventions** | `project_actions` table | `actionService` | `GET /api/v1/actions` |
| **Security & Audit Logs** | `audit_logs` table | `auditService` | `GET /api/v1/audit` |
| **Role-Aware Notifications**| `notifications` table | `notificationService` | `GET /api/v1/notifications` |
| **ML Model Benchmarks** | `model_registry` | `predictionService` | `GET /api/v1/predictions/models` |
| **Grounded AI Answers** | Verified Telemetry Index | `assistantService` | `POST /api/v1/assistant/query` |
