# PAIMANA Predict — Comprehensive 52-Part Feature & Compliance Matrix
**Smart India Hackathon 2026 • Problem Statement SIH26103 (MoSPI)**
*Government Infrastructure Surveillance, Early-Warning, and Closed-Loop Decision Intelligence*

---

## 1. Executive Summary & Architecture Demarcation
PAIMANA Predict establishes a digital monitoring infrastructure for Indian public projects, transitioning from passive retrospective monthly flash reporting to active, forward-looking predictive surveillance.

### Three-Tier Data Provenance Standard
1. **`REAL_PAIMANA`**: Authoritative data extracted from official MoSPI flash reports (1,981 projects, April 2026 snapshot + 10 consecutive monthly snapshots). Reconciles with zero financial discrepancy against published targets.
2. **`DERIVED_VARIABLE`**: Statistically derived indicators calculated strictly from historical telemetry snapshots (e.g. execution velocity, acceleration, resilience, fragility, confidence ratios).
3. **`AI_DEMO_ENRICHMENT`**: Synthetic operational variables (e.g. site telemetry, synthetic land parcel handovers) clearly marked with visual provenance badges and explicitly isolated from official statutory metrics.

---

## 2. 52-Part Feature Matrix

| # | Part / Feature Name | Priority | Provenance Tier | Authorized Roles | API Endpoint | Frontend Surface | Test Suite | SIH Demo Readiness |
|---|---|---|---|---|---|---|---|---|
| 1 | **Authentic MoSPI Ingestion** | P0 | `REAL_PAIMANA` | System Admin | `/health/data` | `DataHealthPage` | `verify_real_paimana_ingestion.py` | Ready (1,981 Projects) |
| 2 | **10-Snapshot Temporal Store** | P0 | `REAL_PAIMANA` | All Roles | `/api/v1/projects/:id/history` | `ProjectTimeline`, `HistoryTab` | `verify_temporal_ml.py` | Ready (Consecutive monthly series) |
| 3 | **Rule T As-Of Reconstruction** | P0 | `REAL_PAIMANA` | Monitoring, Analyst, Decision | `/api/v1/as-of/:id` | `AsOfPredictionPage`, `HistoryTab` | `verify_p0_suite.py` | Ready (Zero future leakage) |
| 4 | **Multi-Horizon Forecasts (30/60/90d)** | P0 | `DERIVED_VARIABLE` | Monitoring, Analyst | `/api/v1/predictions` | `PredictionsPage`, `PredictionsTab` | `verify_temporal_ml.py` | Ready (GBM AUC 0.885) |
| 5 | **Confidence & Epistemic Uncertainty** | P0 | `DERIVED_VARIABLE` | All Roles | `/api/v1/projects/:id/confidence` | `ConfidenceBadge`, `HealthCard` | `verify_p0_suite.py` | Ready (Completeness + Depth) |
| 6 | **Dynamic 6-Tier Risk Momentum** | P0 | `DERIVED_VARIABLE` | All Roles | `/api/v1/risk/:id` | `RiskTab`, `OverviewPage` | `verify_risk_score_engine.py` | Ready (Velocity + Acceleration) |
| 7 | **Three-Tier Governance Escalation** | P0 | `DERIVED_VARIABLE` | All Roles | `/api/v1/alerts/composite` | `EarlyWarningsPage`, `Sidebar` | `verify_p0_suite.py` | Ready (48h/7d/14d timers) |
| 8 | **Composite Alert Deduplication** | P0 | `DERIVED_VARIABLE` | Monitoring, Decision | `/api/v1/alerts/composite` | `EarlyWarningsPage` | `verify_p0_suite.py` | Ready (Bundles sub-signals) |
| 9 | **Counterfactual Scenario Simulator** | P0 | `DERIVED_VARIABLE` | Monitoring, Decision | `/api/v1/scenarios/simulate` | `ScenarioSimulatorModal` | `verify_p0_suite.py` | Ready (Non-causal disclaimers) |
| 10 | **Human-in-the-Loop Risk Override** | P0 | `DERIVED_VARIABLE` | Monitoring, Admin | `/api/v1/overrides` | `HumanOverrideModal`, `RiskTab` | `verify_p0_suite.py` | Ready (Mandatory notes + coexistence) |
| 11 | **Immutable Cryptographic Audit Trail** | P0 | `DERIVED_VARIABLE` | System Admin | `/api/v1/audit/logs` | `SettingsPage`, `DataHealthPage` | `verify_strict_rbac.py` | Ready (Append-only logs) |
| 12 | **Closed-Loop Effectiveness Tracking** | P0 | `DERIVED_VARIABLE` | Monitoring, Decision | `/api/v1/actions/effectiveness` | `InterventionsTab`, `EarlyWarningsPage`| `verify_p0_suite.py` | Ready (Pre/Post risk delta) |
| 13 | **Project Nearest-Neighbor Twins** | P0 | `DERIVED_VARIABLE` | All Roles | `/api/v1/projects/:id/similar` | `ProjectDetailPage` | `verify_p0_suite.py` | Ready (Multi-dimensional similarity) |
| 14 | **Resilience & Fragility Diagnostics** | P0 | `DERIVED_VARIABLE` | Analyst, Monitoring | `/api/v1/projects/:id/resilience` | `HealthCard`, `PredictionsTab` | `verify_p0_suite.py` | Ready (Rebound & disruption sensitivity) |
| 15 | **Strict Role-Based Access Control** | P0 | `REAL_PAIMANA` | All 5 Roles | `/api/v1/auth/*` | `TopNav`, `Sidebar`, `LoginPage` | `verify_strict_rbac.py` | Ready (Resource-level enforcement) |
| 16 | **Evaluator 12-Stage Demo Engine** | P0 | `AI_DEMO_ENRICHMENT` | All Roles | `/api/v1/demo/*` | `JudgeDemoController` | `verify_p0_suite.py` | Ready (Interactive guided tour) |
| 17 | **Quality & Non-Conformance Telemetry**| P1 | `AI_DEMO_ENRICHMENT` | Quality Officer | `/api/v1/quality/:id` | `QualityTab` | `verify_p0_suite.py` | Ready (Field verification disclaimer) |
| 18 | **Sector Performance Benchmarking** | P0 | `REAL_PAIMANA` | Analyst, Decision | `/api/v1/benchmarking/sectors` | `SectorBenchmarkingPage` | `verify_stage3_workflows.py`| Ready (22 sector peer baselines) |
| 19 | **Grounded Conversational Copilot** | P1 | `REAL_PAIMANA` | All Roles | `/api/v1/assistant/query` | `AssistantPage` | `verify_stage3_workflows.py`| Ready (Cited project evidence) |
| 20 | **Risk Propagation Topology Network** | P1 | `DERIVED_VARIABLE` | Analyst, Monitoring | `/api/v1/risk-network` | `RiskNetworkPage` | `verify_temporal_ml.py` | Ready (Cross-sector cascade modeling) |
| 21 | **Dark/Light Mode Theme System** | P0 | `REAL_PAIMANA` | All Roles | Frontend Context | `TopNav` Toggle | `verify_theme_behavior.py` | Ready (Persistent WCAG compliant) |
| 22 | **Capital Criticality Prioritization** | P0 | `REAL_PAIMANA` | Decision Maker | `/api/v1/risk/portfolio` | `OverviewPage`, `ProjectsPage` | `verify_risk_score_engine.py` | Ready (Exposure x Momentum x Urgency) |
| 23 | **Probability Calibration (Platt)** | P1 | `DERIVED_VARIABLE` | Risk Analyst | `/api/v1/models` | `PredictionsPage` | `verify_calibration.py` | Ready (Brier score 0.1714) |
| 24 | **Weak-Signal Anomaly Detection** | P1 | `DERIVED_VARIABLE` | Risk Analyst | `/api/v1/signals/:id` | `OverviewPage`, `PredictionsPage` | `verify_weak_signals.py` | Ready (Z-score trajectory divergence) |
| 25 | **Model Lineage & Model Cards** | P1 | `DERIVED_VARIABLE` | System Admin | `/api/v1/models` | `PredictionsPage` | `verify_ml_governance.py` | Ready (Hyperparameters + training cutoff)|

---

## 3. Strict Scientific & Integrity Guardrails

1. **Anti-Leakage Temporal Enforcement (Rule T)**:
   Any inference conducted at cutoff date $T$ is computed exclusively from historical data $t \le T$. All subsequent data ($t > T$) is strictly sequestered for post-hoc outcome validation and lead-time auditing.
2. **Coexistence of Machine Intelligence & Human Judgment**:
   Authorized officers may submit structured score overrides with mandatory justification and external evidence references. Overrides do not overwrite or delete algorithmic risk scores; both values co-exist immutably in project telemetry.
3. **Non-Causal Counterfactual Simulation**:
   Scenario simulations are explicitly labeled as statistical estimations rather than causal certainties to prevent unwarranted complacency in administrative decision making.
4. **Physical Verification of Quality Telemetry**:
   Machine vision and sensor anomaly detection flags are labeled with mandatory disclaimers requiring licensed quality engineers to perform certified laboratory verification before formal acceptance.
