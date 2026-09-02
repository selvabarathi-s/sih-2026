# PAIMANA Predict — Security Architecture & Access Control

## 1. Security Principles

PAIMANA Predict is built on a **Defense-in-Depth** security philosophy:
1. **Zero Trust API Boundaries**: Every endpoint validates input types, ranges, and formats.
2. **Least Privilege Data Access**: Granular Role-Based Access Control (RBAC) across monitoring roles.
3. **Immutability of Audit Trails**: Ingestion runs, status updates, and user queries are recorded in structured audit logs.
4. **No Secrets in Code**: All sensitive credentials, tokens, and database connection strings are managed strictly via environment variables.

---

## 2. Role-Based Access Control (RBAC) Matrix

| User Role | View Public Telemetry | Query Grounded AI | Change Warning Status | Trigger Ingestion Run | Manage ML Models |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Public Observer** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Monitoring Officer** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Ministry Admin** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **System ML Engineer** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 3. Production Security Baseline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. CORS Configuration: Configurable via process.env.CORS_ORIGIN             │
│ 2. Rate Limiting: 100 requests per 15-minute window per IP                  │
│ 3. Security Headers: Strict-Transport-Security, X-Content-Type-Options      │
│ 4. SQL Injection Protection: Parameterized SQL queries via ORM / db adapter │
│ 5. Payload Limits: Max JSON body size restricted to 10MB                    │
│ 6. Sanitization: All text inputs stripped of harmful script injections     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Environment Secret Management

- Use `.env.example` as the canonical template.
- Never commit `.env` or `.env.production` to source control.
- In cloud deployments (Render, GCP, AWS), use secure platform environment variable vaults.
