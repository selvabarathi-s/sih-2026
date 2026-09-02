# PAIMANA Predict — Database Schema & Data Dictionary

## 1. Relational Database Overview

PAIMANA Predict utilizes a normalized relational PostgreSQL schema to support **1,981+ authentic projects**, **10 chronological monthly snapshot reports**, role-based access control, dynamic intervention workflows, and security audit trails.

---

## 2. Table Specifications

### 2.1 Master Data Tables
- **`ministries`**: 16 Central Line Ministries & Departments.
- **`sectors`**: 22 Infrastructure Sectors (Telecommunication, Railways, Road Transport, Power, Petroleum, etc.).
- **`states`**: States and PAN India regions.
- **`agencies`**: Implementing entities (e.g. NHAI, BBNL, NHSRCL, DFCCIL, NTPC, RVNL).

### 2.2 User & RBAC Tables
- **`roles`**: Master role definitions (`SYSTEM_ADMIN`, `MONITORING_OFFICER`, `PROJECT_ADMIN`, `DATA_ANALYST`, `DECISION_MAKER`).
- **`permissions`**: 29 Granular action permissions (`view:portfolio`, `update:progress`, `assign:interventions`, etc.).
- **`role_permissions`**: Many-to-Many mapping table between roles and permissions.
- **`users`**: User credentials, department, designation, and active session attributes.
- **`user_assigned_projects`**: Scopes Project Administrators to specific project codes (e.g., BharatNet `PAI-706775`).

### 2.3 Core Project & Time-Series Tables
- **`projects`**:
  - `id` (`VARCHAR(64)` PRIMARY KEY, e.g. `PAI-706775`)
  - `project_code` (`VARCHAR(32)` UNIQUE, e.g. `706775`)
  - `project_name` (`VARCHAR(512)`)
  - `original_cost` (`NUMERIC(15, 2)` ₹ Cr)
  - `revised_cost` (`NUMERIC(15, 2)` ₹ Cr)
  - `cumulative_expenditure` (`NUMERIC(15, 2)` ₹ Cr)
  - `cost_overrun_cr` (`NUMERIC(15, 2)` GENERATED STORED)
  - `cost_growth_pct` (`NUMERIC(8, 2)` GENERATED STORED)
  - `expenditure_ratio_pct` (`NUMERIC(8, 2)` GENERATED STORED)
  - `physical_progress` (`NUMERIC(5, 2)` %)
  - `current_risk_state` (`VARCHAR(32)` Default: `ON_TRACK`)
- **`project_snapshots`**:
  - `(project_id, report_date_key)` UNIQUE constraint
  - 10 monthly observations (`2025-10` to `2026-07`)

### 2.4 Workflow, ML & Audit Tables
- **`project_actions`**: Dynamic interventions assigned by monitoring officers.
- **`action_status_history`**: Audit trail of action status transitions.
- **`notifications`**: Role-targeted real-time alerts.
- **`model_registry`**: Machine learning model versions, parameters, and 5-Fold cross-validation metrics.
- **`early_warnings`**: Empirical and predicted deterioration alerts.
- **`audit_logs`**: Immutable security and state-change audit logs.

---

## 3. Relationships & Foreign Key Cardinality

```
Project (1) ────────< (N) ProjectSnapshots
Project (1) ────────< (N) EarlyWarnings
Project (1) ────────< (N) ProjectActions
Project (1) ────────< (N) Recommendations
Project (1) ────────< (N) ProjectPredictions
User    (1) ────────< (N) AssignedProjects
Role    (1) ────────< (N) Users
Role    (N) ────────< (N) Permissions
```
