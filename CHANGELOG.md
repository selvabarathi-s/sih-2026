# CHANGELOG — PAIMANA Predict (SIH 2026 Problem Statement SIH26103)

All notable additions, architectural refactors, and scientific enhancements across PAIMANA Predict are recorded here.

---

## [v2.4.0-Production-Governed] - 2026-09-13

### Added
- **As-Of Historical Reconstruction Engine (Rule T)**:
  - Created [`asOfService.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/asOfService.js) to reconstruct full project state strictly as of any historical cutoff period $T$ ($t \le T$).
  - Added strict isolation preventing leakage of future snapshots ($t > T$). Sequestered future snapshots strictly for post-hoc outcome evaluation and lead-time calculation.
  - Implemented `/api/v1/as-of/:id` and `/api/v1/as-of/cutoffs` endpoints.
  - Built dedicated [`AsOfPredictionPage.tsx`](file:///d:/SIH/SIH%202026%20prototype/src/pages/AsOfPredictionPage.tsx) featuring timeline partition comparison between pre-cutoff inputs and post-cutoff actual outcomes.
- **Prediction Confidence & Epistemic Uncertainty Engine**:
  - Implemented [`confidenceEngine.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/confidenceEngine.js) evaluating prediction confidence across 4 verifiable dimensions: Data Completeness (35%), Snapshot History Depth (25%), Velocity Stability (20%), and Model Calibration (20%).
  - Exposed `/api/v1/projects/:id/confidence` endpoint.
  - Created [`ConfidenceBadge.tsx`](file:///d:/SIH/SIH%202026%20prototype/src/components/common/ConfidenceBadge.tsx) visual component showing epistemic certainty tiers (`HIGH`, `MODERATE`, `LOW`) and health warnings.
- **Deduplicated Composite Alert Engine**:
  - Created [`compositeAlertEngine.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/compositeAlertEngine.js) solving alert fatigue by consolidating cost, schedule, velocity, and decoupling flags into a single composite warning per project.
  - Added SLA countdown timers (48h acknowledgment, 7d action plan, 14d evidence) and 3-tier governance escalation (Level 1: Monitoring Officer, Level 2: Senior Authority, Level 3: Cabinet/PMO).
  - Exposed `/api/v1/alerts/composite` endpoint.
  - Enhanced [`EarlyWarningsPage.tsx`](file:///d:/SIH/SIH%202026%20prototype/src/pages/EarlyWarningsPage.tsx) with composite signal accordions, SLA timers, and escalation badges.
- **Counterfactual Scenario Simulator**:
  - Created [`scenarioService.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/scenarioService.js) modeling outcomes under "Do Nothing", "Fast-Track ROW", "Dual-Shift Construction", and "Empowered Taskforce".
  - Incorporated prominent non-causal disclaimers stating that predictions are model-based correlations, not causal certainties.
  - Created [`ScenarioSimulatorModal.tsx`](file:///d:/SIH/SIH%202026%20prototype/src/components/scenarios/ScenarioSimulatorModal.tsx) for interactive "What-If" decision modeling.
- **Human-in-the-Loop Risk Override & Immutable Audit Logging**:
  - Implemented [`overrideService.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/overrideService.js) enabling authorized officers to submit formal review overrides with mandatory justification notes (minimum 10 characters) and evidence links.
  - Preserved both AI risk score and human override score concurrently (non-destructive coexistence).
  - Integrated with [`auditService.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/auditService.js) to emit immutable audit logs with officer identification.
  - Created [`HumanOverrideModal.tsx`](file:///d:/SIH/SIH%202026%20prototype/src/components/common/HumanOverrideModal.tsx).
- **Intervention Closed-Loop Effectiveness Tracking**:
  - Created [`interventionEffectivenessService.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/interventionEffectivenessService.js) measuring pre/post intervention risk score reduction and historical category success rates (e.g. Utility Shifting 82%).
  - Exposed `/api/v1/actions/effectiveness` and `/api/v1/actions/outcomes` endpoints.
- **Diagnostic Resilience & Fragility Intelligence**:
  - Implemented [`resilienceService.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/resilienceService.js) computing platform-derived Resilience (pacing rebound capacity) and Fragility (milestone disruption sensitivity).
  - Exposed `/api/v1/projects/:id/resilience` endpoint with `DERIVED_VARIABLE` provenance metadata.
- **Project Similarity & Historical Twin Matcher**:
  - Created [`projectSimilarityService.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/projectSimilarityService.js) matching nearest-neighbor historical projects across Sector, Outlay Scale, Execution Stage, and Schedule Extension profile.
  - Exposed `/api/v1/projects/:id/similar` endpoint.
- **Quality & Non-Conformance Telemetry**:
  - Implemented [`qualityService.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/qualityService.js) supporting Non-Conformance Reports (NCRs), certified laboratory tests, and site photo anomaly signals with physical verification disclaimers.
  - Exposed `/api/v1/quality/:id` endpoint.
- **Evaluator 12-Stage Guided Demo Journey**:
  - Implemented [`demoService.js`](file:///d:/SIH/SIH%202026%20prototype/backend/src/services/demoService.js) providing a stateful 12-stage guided journey through the full predictive workflow in < 2 minutes.
  - Created [`JudgeDemoController.tsx`](file:///d:/SIH/SIH%202026%20prototype/src/components/demo/JudgeDemoController.tsx) embedded in the top layout for one-click step progression and instant reset.
- **Automated Verification Suite**:
  - Created [`tests/verify_p0_suite.py`](file:///d:/SIH/SIH%202026%20prototype/tests/verify_p0_suite.py) testing all P0 capabilities end-to-end.
  - Integrated into [`tests/verify_all.py`](file:///d:/SIH/SIH%202026%20prototype/tests/verify_all.py) bringing total passing test suites to 18 (100% success rate).

### Changed & Hardened
- **Dynamic Risk Scoring Engine (`riskScoreEngine.js`)**:
  - Upgraded to version `risk-v2.3-dynamic` with 6 standardized momentum categories (`STABLE`, `IMPROVING`, `DETERIORATING`, `RAPIDLY_DETERIORATING`, `CRITICAL_ACCELERATION`, `RECOVERING`).
  - Integrated Capital Criticality ($C = \text{Outlay} \times \text{Momentum} \times \text{Urgency}$) to separate risk likelihood from national fiscal exposure.
- **Strict Role-Based Access Control**:
  - Enforced resource-level project assignment authorization: Nodal Officers (`project_admin`) can only modify projects explicitly assigned in their user profile (`assigned_projects`), returning 403 Forbidden on unassigned projects.
  - Hardened audit log route inspection to authorized governance roles (`system_admin`).
- **Project Detail View (`ProjectDetailPage.tsx`)**:
  - Upgraded to 9 comprehensive tabs: Overview, Risk, Predictions, Timeline, Propagation, Interventions, Quality, Evidence, History.
  - Integrated dynamic human override displays, live confidence badges, and provenance metadata indicators.
- **Navigation & Layout**:
  - Added As-Of Reconstruction into [`Sidebar.tsx`](file:///d:/SIH/SIH%202026%20prototype/src/components/layout/Sidebar.tsx) across relevant roles.
  - Mounted `/as-of-prediction` route in [`App.tsx`](file:///d:/SIH/SIH%202026%20prototype/src/App.tsx).
