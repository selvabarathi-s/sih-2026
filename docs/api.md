# PAIMANA Predict — REST API Specification (v1)

## Base URL
- **Local Development**: `http://localhost:3000/api/v1`
- **Render Production**: `https://<service-name>.onrender.com/api/v1`

---

## 1. Health & Surveillance Endpoints

### `GET /health`
Returns system uptime, environment, and persistence backend health status.

**Response `200 OK`:**
```json
{
  "status": "healthy",
  "service": "paimana-predict-backend",
  "version": "1.0.0",
  "environment": "production",
  "uptime_seconds": 12450,
  "database": {
    "status": "healthy",
    "storageBackend": "postgres",
    "recordsAvailable": 1981,
    "reconciliationStatus": "PASS (100.0% match)"
  }
}
```

### `GET /health/data`
Returns dataset provenance, total projects, snapshot depth, and reconciliation status.

**Response `200 OK`:**
```json
{
  "status": "healthy",
  "authoritative_snapshot": "April 2026",
  "projects_count": 1981,
  "snapshots_depth": 10,
  "distinct_projects_tracked": 2185,
  "reconciliation": {
    "status": "PASS",
    "original_cost_delta_pct": 0.0,
    "revised_cost_delta_pct": 0.0,
    "expenditure_delta_pct": 0.0
  }
}
```

### `GET /health/ml`
Returns status of the machine learning inference engine and model registry.

---

## 2. Project Endpoints

### `GET /api/v1/projects`
List projects with filtering, full-text search, multi-column sorting, and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search` | `string` | `""` | Search across project name, ID, code, or agency |
| `ministry` | `string` | `""` | Filter by Central Line Ministry |
| `sector` | `string` | `""` | Filter by Infrastructure Sector |
| `state` | `string` | `""` | Filter by State / Region |
| `costEscalatedOnly` | `boolean` | `false` | Return only cost-revised projects |
| `scheduleExtendedOnly`| `boolean` | `false` | Return only schedule-extended projects |
| `limit` | `integer` | `50` | Number of items per page |
| `offset` | `integer` | `0` | Pagination offset |
| `sortBy` | `string` | `"revised_cost"`| Field to sort on |
| `sortOrder` | `string` | `"desc"` | Sort direction (`"asc"` or `"desc"`) |

**Response `200 OK`:**
```json
{
  "data": [
    {
      "project_id": "PAI-706775",
      "project_code": "706775",
      "project_name": "BharatNet",
      "ministry": "Department of Telecommunications",
      "sector": "Telecommunication",
      "state": "PAN India",
      "original_cost": 61109.0,
      "revised_cost": 188000.0,
      "cumulative_expenditure": 46431.54,
      "cost_growth_pct": 207.65,
      "physical_progress": 82.4,
      "is_cost_escalated": true,
      "is_schedule_extended": true
    }
  ],
  "pagination": {
    "total": 1981,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

### `GET /api/v1/projects/:id`
Fetch complete structured profile for a project, including multi-snapshot history and unprovided fields notice.

### `GET /api/v1/projects/:id/history`
Fetch chronological time series snapshots for the project across the 10 monthly reporting periods (`2025-10` to `2026-07`).

---

## 3. Portfolio Endpoints

### `GET /api/v1/portfolio/summary`
Returns macro financial totals (Original: ₹37.12L Cr, Revised: ₹42.78L Cr, Exp: ₹20.36L Cr), sector aggregations, and top cost escalations.

### `GET /api/v1/portfolio/sectors`
Returns project count, total original cost, revised cost, and cumulative outlay across all 22 infrastructure sectors.

---

## 4. Deterioration Signals & Warnings

### `GET /api/v1/alerts/signals`
Returns empirical deterioration signals based on observed multi-period stagnation and cost revisions exceeding 20%.

---

## 5. Machine Learning & Benchmarks

### `GET /api/v1/predictions/models`
Returns the cross-validated model registry comparing **Gradient Boosting (0.916 ROC-AUC)** vs Random Forest, Logistic Regression, and baseline CUF variables.

---

## 6. Grounded AI Assistant

### `POST /api/v1/assistant/query`
Natural language grounded retrieval over the 1,981 project dataset.

**Request Body:**
```json
{
  "query": "Tell me about BharatNet"
}
```

**Response `200 OK`:**
```json
{
  "query": "Tell me about BharatNet",
  "timestamp": "2026-09-02T07:32:16.126Z",
  "intent": "PROJECT_LOOKUP",
  "project_id": "PAI-706775",
  "content": "### Grounded Project Profile: BharatNet (`PAI-706775`)...",
  "evidence": {
    "dataSource": "Table 6, Flash Report April 2026 • MoSPI",
    "metrics": {
      "Original Cost": "₹61,109 Cr",
      "Revised Cost": "₹1,88,000 Cr",
      "Observed Revision": "+207.65%",
      "Progress": "82.4%"
    }
  }
}
```
