# PAIMANA Predict — Production Deployment Guide

## 1. Deployment Architecture

PAIMANA Predict is packaged as a unified Node.js full-stack application capable of running on Render, AWS App Runner, Google Cloud Run, or Kubernetes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RENDER / CLOUD CONTAINER                        │
│                                                                        │
│  ┌───────────────────────┐           ┌──────────────────────────────┐  │
│  │   Vite Frontend SPA   │  (Static) │   Express REST API Engine    │  │
│  │   (dist/index.html)   │◄──────────┤   (backend/src/app.js)       │  │
│  └───────────────────────┘           └──────────────┬───────────────┘  │
│                                                     │                  │
│                                                     ▼                  │
│                                      ┌──────────────────────────────┐  │
│                                      │   Normalized Data / Postgres │  │
│                                      │   (data/normalized & SQL)    │  │
│                                      └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Render Blueprint Specification (`render.yaml`)

```yaml
services:
  - type: web
    name: sih-2026-paimana-predict
    runtime: node
    plan: free
    region: oregon
    buildCommand: npm install && npm run build
    startCommand: npm run start
    healthCheckPath: /healthz
    envVars:
      - key: NODE_VERSION
        value: 20.18.0
      - key: NODE_ENV
        value: production
```

---

## 3. Zero-Downtime Health Probes

The deployment exposes three standardized health endpoints:

| Endpoint | Purpose | Target Probe |
| :--- | :--- | :--- |
| `GET /health` | System liveness, uptime, memory, and database status | Container orchestrator liveness |
| `GET /health/data` | Data provenance and reconciliation status (PASS) | Ingestion validation checks |
| `GET /health/ml` | Machine learning framework and inference readiness | Model server monitoring |
| `GET /healthz` | Lightweight Render / Kubernetes ping probe | Platform load balancer probe |

---

## 4. Build & Start Commands

```bash
# 1. Install all dependencies (Backend + Frontend)
npm install

# 2. Build production frontend assets (TypeScript + Vite)
npm run build

# 3. Start production web service
npm run start
```
