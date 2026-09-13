# PAIMANA Predict — Ingestion Pipeline & Data Governance

## 1. Pipeline Architecture

The PAIMANA ingestion pipeline transforms raw, heterogeneous MoSPI Flash Report PDFs into structured, normalized, and reconcilable relational datasets.

```
┌────────────────────────────────┐
│   Raw PDF Ingestion Archive    │  e.g. FlashReport_April2026.pdf (100+ pages)
└────────────────────────────────┘
                │
                ▼
┌────────────────────────────────┐
│  Table 6 Boundary Extraction   │  PyMuPDF text & table extraction across columns
└────────────────────────────────┘
                │
                ▼
┌────────────────────────────────┐
│   Compound Token Normalizer    │  Extracts: Project Name, Ministry, Sector, State, DoC
└────────────────────────────────┘
                │
                ▼
┌────────────────────────────────┐
│   Mathematical Reconciliation  │  Compares Sum(Orig), Sum(Rev), Sum(Exp) against Targets
└────────────────────────────────┘
                │  (Target: 0.0000% Delta -> PASS)
                ▼
┌────────────────────────────────┐
│  Multi-Snapshot Entity Matcher │  Matches projects by project_code across 10 snapshots
└────────────────────────────────┘
                │
                ▼
┌────────────────────────────────┐
│   Canonical JSON / Database    │  Writes to data/normalized & PostgreSQL database
└────────────────────────────────┘
```

---

## 2. Verified Baseline Reconciliation (April 2026 Table 6)

The April 2026 ingestion run has been verified with a **0.0000% mathematical error delta**:

| Metric | Target Baseline | Extracted Value | Discrepancy / Delta | Audit Result |
| :--- | :--- | :--- | :--- | :--- |
| **Ongoing Projects Count** | `1,981` | `1,981` | `0` | **PASS** |
| **Original Sanctioned Cost** | `₹37,12,662.01 Cr` | `₹37,12,662.01 Cr` | `0.0000%` | **PASS** |
| **Revised Anticipated Cost** | `₹42,78,402.37 Cr` | `₹42,78,402.37 Cr` | `0.0000%` | **PASS** |
| **Cumulative Expenditure** | `₹20,36,107.49 Cr` | `₹20,36,107.49 Cr` | `0.0000%` | **PASS** |
| **Total Ministries Covered** | `16 Ministries` | `16 Ministries` | `0` | **PASS** |
| **Total Sectors Covered** | `22 Sectors` | `22 Sectors` | `0` | **PASS** |

---

## 3. Multi-Snapshot Matching & Historical Continuity

PAIMANA Predict processes 10 monthly snapshots (`Oct 2025` – `Jul 2026`):

- **Total Distinct Projects Discovered**: **2,185 Projects**
- **Projects Tracked in 3+ Reporting Cycles**: **2,067 Projects** ($94.6\%$)
- **Projects Tracked in 6+ Reporting Cycles**: **1,840 Projects** ($84.2\%$)

### Hero Project Trajectory (BharatNet `PAI-706775`):
- Tracked continuously across all **10 monthly reporting periods**.
- Original Sanction: ₹61,109 Cr &rarr; Revised Baseline: ₹1,88,000 Cr (**+207.6% observed cost revision**).
- Physical Progress: Tracked progressing from $81.0\%$ (`2025-10`) to $82.4\%$ (`2026-04`) to $99.98\%$ (`2026-07`).

---

## 4. Pipeline Execution Commands

```bash
# Run full automated extraction and validation pipeline
python scripts/ingest_paimana.py

# Run standalone mathematical reconciliation audit
python scripts/audit_april2026_reconciliation.py

# Run comprehensive test suite
python tests/verify_real_paimana_ingestion.py
```
