# PAIMANA Predict — System Architecture & Technical Specification

## 1. Executive Summary

**PAIMANA Predict** (Smart India Hackathon 2026, **Problem Statement 26103**) is a mission-critical infrastructure surveillance and decision-support platform designed to transform descriptive monthly project reporting from the Ministry of Statistics & Programme Implementation (MoSPI) into proactive risk intelligence, root-cause explainability, and prescriptive interventions.

This document outlines the transition from the verified prototype into a production-grade, maintainable software architecture.

---

## 2. Architecture Overview & Component Separation

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (Presentation)                              │
│  React 18 • TypeScript • Tailwind CSS • Recharts • Vite SPA • Accessible Design System │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼  HTTPS / JSON
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY & WEB SERVICE LAYER                           │
│  Node.js / Express • Route Versioning (/api/v1) • CORS • Request Logger • Error Handler│
└────────────────────────────────────────────────────────────────────────────────────────┘
            │                               │                             │
            ▼                               ▼                             ▼
┌───────────────────────┐       ┌───────────────────────┐     ┌────────────────────────┐
│   PROJECT & HISTORY   │       │   ALERT & SIGNAL      │     │  GROUNDED INTELLIGENCE │
│   DOMAIN SERVICE      │       │   DOMAIN SERVICE      │     │  COPILOT SERVICE       │
└───────────────────────┘       └───────────────────────┘     └────────────────────────┘
            │                               │                             │
            └───────────────────────────────┼─────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             PERSISTENCE & REPOSITORY TIER                              │
│  PostgreSQL (Relational Store) • Normalized Data Models • Multi-Snapshot Time Series   │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                            ▲
                                            │
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              INGESTION & ML PIPELINE TIER                              │
│  Python 3.10+ • PyMuPDF • Parquet Engine • Scikit-Learn Model Registry (Anti-Leakage) │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Layer Responsibilities

### 3.1 Client Tier (`src/` / `frontend/`)
- **Responsibilities**:
  - UI Presentation, accessible theme management (Light default / Dark optional).
  - Client routing (`react-router-dom`), view state management.
  - Interactive data visualizations (Recharts multi-month progress curves, cost comparisons).
  - Consuming backend REST APIs via HTTP client abstractions.
- **Strict Boundary**:
  - The client tier must **never** parse raw PDF reports.
  - The client tier must **never** hardcode business calculations or risk inferences.

### 3.2 Backend Service Tier (`backend/src/`)
- **Responsibilities**:
  - REST API endpoint exposure under `/api/v1/`.
  - Input validation, query sanitization, and structured error responses.
  - Domain business logic: project retrieval, portfolio summarization, deterioration signal detection.
  - Grounded natural language retrieval for the AI Copilot.
  - Health check probes (`/health`, `/health/data`, `/health/ml`).

### 3.3 Persistence Tier (`backend/src/database/` & `data/`)
- **Responsibilities**:
  - Relational integrity across master entities (`projects`, `ministries`, `sectors`, `states`).
  - Time-series snapshots (`project_snapshots`) joined on stable project identifiers (`project_code`).
  - Strict reconciliation audit trail (`ingestion_runs`).

### 3.4 ML Pipeline & Model Registry (`ml/`)
- **Responsibilities**:
  - Offline feature engineering and cross-validation on enriched operational variables.
  - Enforcement of the **Strict Anti-Temporal Leakage Policy**.
  - Versioned model serialization and feature importance computation.

---

## 4. Single Source of Truth Domain Mapping

| Domain Entity | Authoritative Source | Service Layer | API Endpoint |
| :--- | :--- | :--- | :--- |
| **Project Master & Financials** | `projects` table | `projectService` | `GET /api/v1/projects/:id` |
| **Multi-Month Snapshots** | `project_snapshots` table | `projectService` | `GET /api/v1/projects/:id/history` |
| **Portfolio Macro Metrics** | `paimana_portfolio_summary.json` | `portfolioService` | `GET /api/v1/portfolio/summary` |
| **Deterioration Signals** | `early_warnings` table | `alertService` | `GET /api/v1/alerts/signals` |
| **ML Model Benchmarks** | `model_registry` | `predictionService` | `GET /api/v1/predictions/models` |
| **Grounded AI Answers** | Verified Telemetry Index | `assistantService` | `POST /api/v1/assistant/query` |
| **Ingestion Provenance** | `ingestion_runs` table | `portfolioService` | `GET /health/data` |

---

## 5. Incremental Migration Roadmap

```
Stage 1: Repository Architecture & Backend Skeleton (COMPLETE)
Stage 2: Relational Database Migration (PostgreSQL / Drizzle ORM)
Stage 3: Automated Ingestion Daemon & Snapshot Matcher
Stage 4: Client Migration from Local JSON to Backend REST API
Stage 5: Role-Based Access Control (RBAC) & Authentication
Stage 6: Real-Time ML Inference Microservice
```
