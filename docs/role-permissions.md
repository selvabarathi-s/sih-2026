# PAIMANA Predict — Role-Based Access Control (RBAC) & Workspaces

## 1. Overview & Architecture

PAIMANA Predict provides a unified multi-tenant government surveillance architecture:

$$\text{ONE PLATFORM} + \text{ONE BACKEND} + \text{ONE DATABASE} + \text{RBAC} + \text{ROLE-SPECIFIC WORKSPACES}$$

Users authenticate via secure credentials, their role and permissions are dynamically resolved, and the interface configures the active workspace accordingly.

---

## 2. Initial Roles & Seed Accounts

| Role Code | Role Name | Seed Username | Password | Department | Target Workspace |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SYSTEM_ADMIN` | System Administrator | `admin` | `admin123` | PMO Infrastructure Cell | Admin & Audit Workspace |
| `MONITORING_OFFICER` | Monitoring Officer | `officer` | `officer123` | MoSPI Monitoring Division | Surveillance & Signals Workspace |
| `PROJECT_ADMIN` | Project Administrator / Nodal Officer | `nodal` | `nodal123` | Implementing Agencies (e.g. BBNL) | Assigned Projects & Action Workspace |
| `DATA_ANALYST` | Risk / Data Analyst | `analyst` | `analyst123` | NITI Aayog Analytics Unit | Analytics, ML Models & Quality Workspace |
| `DECISION_MAKER` | Senior Decision Maker | `secretary` | `secretary123` | Cabinet Secretariat / PMO | Executive Portfolio & Exposure Workspace |

---

## 3. Granular RBAC Permission Matrix

| Permission Code | Description | System Admin | Monitoring Officer | Project Admin | Data Analyst | Decision Maker |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `view:portfolio` | View macroeconomic portfolio totals & summaries | ✅ | ✅ | ❌ | ✅ | ✅ |
| `investigate:projects` | Search & inspect any of the 1,981 project profiles | ✅ | ✅ | ❌ | ✅ | ❌ |
| `view:assigned_projects` | View & manage assigned infrastructure undertakings | ❌ | ❌ | ✅ | ❌ | ❌ |
| `update:progress` | Submit reported physical progress & expenditure | ❌ | ❌ | ✅ | ❌ | ❌ |
| `update:milestones` | Submit target completion dates & revised DoC | ❌ | ❌ | ✅ | ❌ | ❌ |
| `view:risks` | View multi-dimensional risk scores & drivers | ❌ | ✅ | ❌ | ✅ | ✅ |
| `review:warnings` | Inspect historical deterioration signals & warnings | ❌ | ✅ | ❌ | ✅ | ✅ |
| `acknowledge:warnings` | Acknowledge early warnings & trigger escalations | ❌ | ✅ | ❌ | ❌ | ❌ |
| `respond:warnings` | Submit project administration mitigation responses | ❌ | ❌ | ✅ | ❌ | ❌ |
| `assign:interventions` | Prescribe recommendations & assign tasks to nodal officers | ❌ | ✅ | ❌ | ❌ | ❌ |
| `update:actions` | Update progress, upload evidence, and resolve actions | ❌ | ✅ | ✅ | ❌ | ❌ |
| `monitor:actions` | Monitor inter-agency action status & SLA compliance | ❌ | ✅ | ❌ | ❌ | ✅ |
| `generate:briefs` | Export PAIMANA Executive Observation Briefs | ❌ | ✅ | ❌ | ❌ | ✅ |
| `view:critical_projects`| View top financial exposure & critical projects | ❌ | ✅ | ❌ | ❌ | ✅ |
| `view:sector_risk` | View sectoral risk distribution & cost revisions | ❌ | ✅ | ❌ | ✅ | ✅ |
| `inspect:datasets` | Inspect normalized JSON, Parquet, and multi-snapshots | ✅ | ❌ | ❌ | ✅ | ❌ |
| `analyze:trends` | Review multi-month S-curves & expenditure velocity | ❌ | ✅ | ❌ | ✅ | ❌ |
| `inspect:anomalies` | Review weak-signals and stagnation outliers | ❌ | ✅ | ❌ | ✅ | ❌ |
| `compare:models` | Compare Gradient Boosting vs RF vs CUF baselines | ✅ | ❌ | ❌ | ✅ | ❌ |
| `inspect:features` | Inspect Shapley feature importance & operational gains | ❌ | ❌ | ❌ | ✅ | ❌ |
| `monitor:performance` | Track ROC-AUC, Precision, Recall, and Lead Times | ✅ | ❌ | ❌ | ✅ | ❌ |
| `review:quality` | Audit reconciliation status (0.0000% error delta) | ✅ | ❌ | ❌ | ✅ | ❌ |
| `manage:users` | Create users, deactivate accounts, reset passwords | ✅ | ❌ | ❌ | ❌ | ❌ |
| `assign:roles` | Modify user roles and assign project scopes | ✅ | ❌ | ❌ | ❌ | ❌ |
| `configure:settings` | Configure platform parameters, thresholds & CORS | ✅ | ❌ | ❌ | ❌ | ❌ |
| `inspect:ingestion` | Run & audit PDF extraction pipelines | ✅ | ❌ | ❌ | ✅ | ❌ |
| `inspect:models` | Manage active model versions in registry | ✅ | ❌ | ❌ | ✅ | ❌ |
| `inspect:audit` | Inspect security audit trails & user action logs | ✅ | ❌ | ❌ | ❌ | ❌ |
| `inspect:health` | Monitor backend health probes & database status | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 4. Middleware Enforcement

RBAC is enforced programmatically in the Express backend using `requireRole` and `requirePermission` middleware:

```javascript
import { authenticate, requirePermission } from '../middleware/rbac.js';
import { PERMISSIONS } from '../models/userModel.js';

// Nodal Officer updates physical progress
router.post(
  '/projects/:id/update',
  authenticate,
  requirePermission(PERMISSIONS.UPDATE_PROGRESS),
  updateProjectProgress
);

// Monitoring Officer assigns administrative intervention
router.post(
  '/actions/assign',
  authenticate,
  requirePermission(PERMISSIONS.ASSIGN_INTERVENTIONS),
  assignAction
);
```
