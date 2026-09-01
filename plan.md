# PLAN.md — SIH 2026 Problem Statement 26103
## PAIMANA Predictive Intelligence & Early Warning Prototype

> **Role of this document:** This is the first planning/input document for Antigravity.
> Antigravity should treat this file as the product blueprint and implementation contract.
> Build the prototype in phases, keep the architecture extensible, and do not over-engineer the first working demo.

---

## 1. Product Mission

Build a convincing, interactive prototype for SIH 2026 Problem Statement **26103**:

**“Use case on web-based integrated project-monitoring platform”**

The prototype should demonstrate how the existing PAIMANA monitoring ecosystem can evolve from:

**Collect → Monitor → Report**

into:

**Collect → Analyze → Predict → Explain → Alert → Recommend**

The system must help policymakers, project administrators, and monitoring agencies answer:

1. Which projects are likely to become delayed?
2. Which projects are likely to experience cost escalation?
3. Why is a project becoming risky?
4. How can one issue propagate into downstream delays/costs?
5. Which projects need intervention first?
6. What action should be taken now?
7. How does AI/ML improve prediction compared with conventional statistical methods?
8. Which additional variables would improve prediction beyond current CUF fields?

---

## 2. Product Name

Use a professional, government-facing product name:

### **PAIMANA Predict**
**AI-Powered Infrastructure Risk Intelligence & Early Warning System**

Optional tagline:

> **Predict. Explain. Prioritize. Prevent.**

Avoid branding that makes the prototype look like a consumer application.

---

## 3. Prototype Objective

The prototype is a **decision-support demonstration**, not a production replacement for PAIMANA.

It must demonstrate the full decision loop:

```text
PAIMANA / OCMS Project Data
          ↓
Data Processing
          ↓
Feature Engineering
          ↓
Prediction
          ↓
Risk Scoring
          ↓
Risk Explanation
          ↓
Risk Propagation
          ↓
Early Warning
          ↓
Recommended Intervention
          ↓
Officer / Policymaker Action
```

The prototype should feel like something a Ministry monitoring officer could actually use.

---

## 4. Important Scope Decision

### Do NOT attempt these in the first prototype

- Do not claim that the prototype is connected to live government PAIMANA data.
- Do not fabricate real government project outcomes.
- Do not present synthetic predictions as official forecasts.
- Do not build a complicated production ML pipeline before the UI works.
- Do not depend on paid APIs.
- Do not require internet access for the core demo.
- Do not make an LLM mandatory for the core functionality.
- Do not hide the fact that prototype data is synthetic/demo data.

### Instead

Create a **realistic synthetic PAIMANA-like dataset** based on the fields described in the problem statement.

Build the system around interfaces that can later accept the actual PAIMANA/OCMS dataset.

---

## 5. Primary User

### Monitoring Officer / Project Administrator

Typical workflow:

```text
Open Dashboard
   ↓
See portfolio risk
   ↓
Filter critical projects
   ↓
Open a project
   ↓
Understand predicted delay/cost risk
   ↓
See risk drivers
   ↓
Trace cascading dependencies
   ↓
Read recommended interventions
   ↓
Create / acknowledge an alert
```

### Secondary User

### Senior Policymaker / Decision Maker

Needs:

- national/sector overview
- top critical projects
- emerging risk trends
- expected financial exposure
- expected schedule exposure
- intervention priorities
- benchmarking

---

# 6. Core Prototype Modules

The prototype must include the following modules.

## Module A — Executive Dashboard

Purpose:

Give a one-screen portfolio overview.

Show:

- Total monitored projects
- Ongoing projects
- High-risk projects
- Projects with predicted cost overrun
- Projects with predicted time overrun
- Total original project cost
- Revised cost exposure
- Estimated potential additional cost
- Estimated potential delay
- Active early warnings
- Projects requiring immediate intervention

### Visualizations

Use clean, readable charts:

1. Risk distribution
2. Cost overrun trend
3. Time overrun trend
4. Projects by sector
5. Risk by sector
6. Monthly warning trend
7. Top 10 high-risk projects

### Hero section

Show:

> **Portfolio Risk Index: 68 / 100**

and a concise statement:

> **126 projects require closer monitoring. 34 are currently in the critical-risk zone.**

These values are demo values and must be clearly sourced from the synthetic dataset.

---

# 7. Module B — Project Intelligence

Create a project list page.

Columns:

- Project ID
- Project Name
- Ministry / Department
- Sector
- State / Region
- Original Cost
- Revised Cost
- Expenditure
- Physical Progress
- Financial Progress
- Schedule Progress
- Risk Score
- Risk Level
- Predicted Delay
- Predicted Cost Overrun
- Last Updated

### Filters

- Sector
- Ministry
- State
- Risk level
- Project status
- Cost range
- Delay range

### Sorting

Allow sorting by:

- highest risk
- highest predicted cost overrun
- largest predicted delay
- lowest physical progress
- highest expenditure gap

---

# 8. Module C — Project Detail / Risk Intelligence Page

This is the most important page for the SIH demo.

When a user opens a project, show:

## Project Header

- Project ID
- Project Name
- Ministry
- Sector
- State
- Implementing Agency
- Project Status

## Financial Summary

- Original Cost
- Revised Cost
- Expenditure
- Remaining Estimated Cost
- Predicted Cost Overrun
- Cost Overrun Probability

## Schedule Summary

- Original Start Date
- Original Completion Date
- Revised Completion Date
- Current Progress
- Predicted Delay
- Delay Probability

## Risk Score

Large visual:

> **Risk Score: 82 / 100 — HIGH**

Break the score into:

- Cost Risk
- Schedule Risk
- Milestone Risk
- Expenditure Risk
- Dependency Risk
- Implementation Risk

---

# 9. Risk Driver Explanation

Do not just output a risk score.

Show:

### “Why is this project at risk?”

Example:

```text
HIGH IMPACT DRIVER
Land acquisition progress: 52%
Expected: 90%
Impact: +18 risk points

MILESTONE SLIPPAGE
3 consecutive milestone delays
Impact: +14 risk points

LOW EXPENDITURE TRAJECTORY
Actual expenditure: 61%
Expected expenditure: 78%
Impact: +11 risk points

DEPENDENCY RISK
Utility shifting pending
Impact: +8 risk points
```

Use explainable visual elements such as:

- horizontal contribution bars
- driver cards
- warning indicators
- before/after comparison

Avoid pretending these contributions are mathematically exact unless the implementation actually calculates them.

---

# 10. Module D — Risk Propagation Network

This is a major differentiator.

Create a visual dependency graph.

Example:

```text
Land Acquisition Delay
          ↓
Construction Start Delay
          ↓
Milestone Slippage
          ↓
Schedule Extension
          ↓
Additional Labour / Overhead
          ↓
Cost Escalation
          ↓
Overall Project Risk ↑
```

Allow the user to click a node.

When clicked, show:

- current status
- severity
- downstream effect
- estimated impact
- recommended mitigation

### UI concept

Use a node-and-edge graph.

Example:

```text
[Land Delay]
     ↓
[Work Start]
     ↓
[Milestone]
     ↓
[Schedule]
     ↓
[Cost]
```

Color nodes according to severity.

Keep this visual simple and readable.

---

# 11. Module E — Early Warning Center

Create a page dedicated to alerts.

Each alert should contain:

- Alert ID
- Project
- Alert Type
- Severity
- Trigger
- Detected On
- Lead Time
- Estimated Impact
- Recommended Action
- Status

Alert types:

- Cost escalation risk
- Schedule delay risk
- Milestone slippage
- Expenditure anomaly
- Progress anomaly
- Dependency risk
- Implementation bottleneck

### Alert lifecycle

```text
Detected
   ↓
Reviewed
   ↓
Acknowledged
   ↓
Action Initiated
   ↓
Resolved
```

Allow demo interactions:

- Acknowledge
- Assign
- Mark action initiated
- Resolve

These can update local application state.

---

# 12. Module F — Predictive Analytics

Create a model comparison page.

The purpose is to explicitly answer the problem statement's question:

> Do AI/ML methods provide gains over conventional statistical methods?

Display:

### Cost Overrun

- Logistic/Linear statistical baseline
- Random Forest
- Gradient Boosting / XGBoost-like model
- Best model

Metrics:

- Accuracy
- Precision
- Recall
- F1
- ROC-AUC
- Early Warning Lead Time

### Time Overrun

Use the same comparison pattern.

### Important

For a prototype, predictions can initially be generated through a deterministic demo inference layer.

The UI must be designed so that a real Python ML service can replace the demo logic later.

---

# 13. Module G — CUF vs Additional Variables

Create a dedicated analytical section.

Compare:

### Model A
**CUF-only**

### Model B
**CUF + Additional Risk Variables**

Show:

```text
CUF-only model
AUC: 0.79

Expanded model
AUC: 0.87

Improvement
+10.1%
```

Use illustrative/demo values only.

Clearly label:

> **Prototype benchmark — synthetic demonstration**

Candidate additional variables:

- land acquisition status
- environmental clearance
- utility shifting
- contractor performance
- tender/contract delay
- material availability
- labour availability
- payment/approval delay
- weather disruption
- dependency on another project
- local disruption

---

# 14. Module H — Benchmarking & Comparative Analytics

Allow comparison between similar projects.

Example dimensions:

- sector
- project cost band
- geography
- implementing agency
- project age
- project duration

Example output:

```text
Selected Project
Risk Score: 82

Peer Median
Risk Score: 59

Difference
+23 points
```

Show:

- progress benchmark
- expenditure benchmark
- schedule benchmark
- cost benchmark
- risk benchmark

The user should understand whether a project is underperforming **relative to comparable projects**, not only against absolute targets.

---

# 15. Module I — Prescriptive Recommendation Engine

For every high-risk project, show:

## Recommended Intervention

Example:

> **Priority 1 — Resolve land acquisition dependency**

Reason:

> Land progress is significantly below the expected trajectory and is blocking two downstream milestones.

Expected benefit:

> Could reduce projected schedule exposure by approximately 2–3 months.

### Recommendation structure

```text
Problem
   ↓
Evidence
   ↓
Impact
   ↓
Recommended Action
   ↓
Expected Benefit
```

Possible recommendation categories:

- Escalate approval
- Resolve land dependency
- Expedite tender
- Re-plan milestone
- Increase monitoring frequency
- Review contractor performance
- Reallocate resources
- Coordinate utility shifting
- Review expenditure trajectory
- Conduct focused field inspection

Recommendations should be deterministic/rule-based in the prototype.

Later, an ML/LLM recommendation layer can replace or enhance them.

---

# 16. Module J — LLM Project Intelligence Assistant

Create a chat panel called:

### **Project Intelligence Assistant**

It should support demo questions such as:

- “Why is Project PJ-1042 high risk?”
- “Which projects have the highest delay risk?”
- “Show transport projects with cost escalation risk.”
- “What are the main drivers of risk in this project?”
- “Which project needs intervention first?”
- “What variables would improve the current model?”

For the prototype:

### Preferred implementation

Use a deterministic retrieval/rules layer first.

The assistant reads the local structured demo data and generates grounded responses.

Do not make unsupported claims.

If an actual LLM API is used later, keep it behind an adapter interface.

Suggested architecture:

```text
Assistant UI
     ↓
Question Parser
     ↓
Project/Data Retrieval
     ↓
Evidence Builder
     ↓
Response Generator
```

---

# 17. Data Model

Create a realistic synthetic dataset.

Suggested entity:

## Project

Fields:

```text
project_id
project_name
ministry
department
sector
sub_sector
state
district
implementing_agency
project_type
original_cost
revised_cost
cumulative_expenditure
approved_date
original_start_date
original_completion_date
revised_completion_date
current_completion_forecast
physical_progress
financial_progress
planned_progress
milestones_total
milestones_completed
milestones_delayed
status
monthly_update_date
contractor
land_status
environment_clearance
utility_shift_status
tender_status
labour_status
material_status
weather_disruption
approval_delay
dependency_count
risk_score
cost_overrun_probability
time_overrun_probability
predicted_cost_overrun
predicted_delay_months
```

---

# 18. Synthetic Dataset Requirements

Generate at least:

### 150–300 projects

Across realistic sectors:

- Transport & Logistics
- Energy
- Water & Sanitation
- Communication
- Social Infrastructure
- Coal
- Steel
- Mining

Include realistic distributions:

- low-risk
- medium-risk
- high-risk
- critical-risk

Ensure correlations make sense.

Examples:

- lower physical progress + milestone slippage → higher time risk
- low expenditure trajectory → possible schedule risk
- land acquisition delay → higher schedule risk
- prolonged schedule → higher overhead/cost risk
- revised cost > original cost → evidence of escalation

Avoid random numbers that contradict each other.

---

# 19. Time-Series / Monthly Data

Each project should have historical monthly observations.

Minimum useful structure:

```text
project_id
month
planned_progress
actual_progress
planned_expenditure
actual_expenditure
milestones_due
milestones_completed
issues_open
issues_closed
risk_score
```

This enables the prototype to demonstrate:

- trend analysis
- anomaly detection
- deterioration over time
- early warning lead time

---

# 20. Risk Scoring Logic

Create a transparent demo scoring engine.

Example:

```text
Risk Score =
  20% schedule risk
+ 20% milestone risk
+ 20% cost risk
+ 15% expenditure risk
+ 10% dependency risk
+ 10% implementation risk
+ 5% anomaly score
```

Normalize every component to 0–100.

Risk bands:

```text
0–24   LOW
25–49  MODERATE
50–74  HIGH
75–100 CRITICAL
```

Do not hard-code risk scores for every project.

Calculate them from input features.

---

# 21. Demo Prediction Engine

Create an abstraction such as:

```text
PredictionService
```

with functions conceptually equivalent to:

```text
predictCostOverrun(project)
predictTimeOverrun(project)
calculateRisk(project)
getRiskDrivers(project)
getRecommendations(project)
getEarlyWarnings(project)
```

For MVP:

- deterministic formulas/rules are acceptable
- output should be stable for the same input
- clearly label outputs as prototype predictions

Later:

```text
DemoPredictionService
        ↓
RealMLPredictionService
```

The UI should not need to change.

---

# 22. Technology Stack

Preferred prototype stack:

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide Icons
- React Router

### Data / Prototype Backend

Start simple:

- local JSON / TypeScript seed data
- service/repository layer

Optional API layer:

- Node.js
- Express
- TypeScript

### Real ML integration later

- Python
- FastAPI
- scikit-learn
- XGBoost / LightGBM
- pandas
- NumPy

### Graph visualization

Prefer:

- React Flow

or another open-source graph library.

### Database later

- PostgreSQL

Do not make a database mandatory for the first prototype unless required for persistence.

---

# 23. UI / Visual Design Direction

The product should look like a modern government intelligence and operations platform.

### Design principles

- professional
- data-dense but not cluttered
- strong hierarchy
- minimal decorative graphics
- accessible contrast
- clear warning states
- desktop-first
- responsive enough for tablet
- suitable for projector/demo presentation

Use:

- cards
- tables
- charts
- badges
- timelines
- graph/network views
- alert panels
- KPI blocks

Avoid:

- excessive gradients
- flashy animations
- consumer-style dashboards
- unnecessary glassmorphism
- stock images
- fake futuristic AI graphics

### Suggested visual language

Normal:
neutral / calm

Warning:
amber

Critical:
red

Success:
green

Keep colors semantic and consistent.

---

# 24. Navigation

Recommended left sidebar:

```text
PAIMANA Predict
────────────────────
Overview
Projects
Risk Intelligence
Early Warnings
Risk Network
Predictions
Benchmarking
Analytics
AI Assistant
────────────────────
Data Health
Settings
```

Top bar:

- page title
- search
- last data refresh
- notification indicator
- user/role indicator

---

# 25. Dashboard Information Hierarchy

The user should immediately see:

### Level 1 — What is happening?

Portfolio KPIs.

### Level 2 — Where is the problem?

High-risk project list.

### Level 3 — Why is it happening?

Risk drivers.

### Level 4 — What happens next?

Risk propagation / forecast.

### Level 5 — What should we do?

Prescriptive recommendations.

This hierarchy is extremely important for the final SIH demo.

---

# 26. Example Demo Project

Create at least one hero project designed for the presentation.

Example:

```text
Project ID: PJ-1042

Project: Eastern Freight Corridor Expansion
Sector: Transport & Logistics
State: Example State
Original Cost: ₹8,450 Cr
Revised Cost: ₹9,180 Cr

Physical Progress: 61%
Financial Progress: 58%
Planned Progress: 76%

Risk Score: 82 / 100
Risk Level: CRITICAL

Cost Overrun Probability: 78%
Predicted Cost Exposure: ₹730 Cr

Delay Probability: 86%
Predicted Delay: 7 months
```

Drivers:

```text
Land Acquisition Delay
Milestone Slippage
Utility Shifting
Low Expenditure Trajectory
```

Propagation:

```text
Land Delay
  ↓
Construction Start Delay
  ↓
Milestone Delay
  ↓
Schedule Extension
  ↓
Overhead Increase
  ↓
Cost Escalation
```

Recommendation:

```text
Priority Intervention:
Resolve land acquisition dependency and
conduct focused coordination with affected agencies.
```

All values are synthetic and for prototype demonstration only.

---

# 27. Key UX Interaction

The main “wow” interaction should be:

```text
Dashboard
   ↓
Click HIGH RISK project
   ↓
Project Intelligence opens
   ↓
Click "Why?"
   ↓
Risk drivers animate/highlight
   ↓
Click "Impact Chain"
   ↓
Risk Propagation Network opens
   ↓
Click "Recommended Action"
   ↓
Intervention card appears
```

This should be smooth enough to demonstrate in under 90 seconds.

---

# 28. Prototype Demo Story

Use this exact narrative while building the experience:

### Scene 1 — Portfolio

“Instead of waiting for a project to become delayed, the system detects projects showing early signs of risk.”

### Scene 2 — Prioritization

“Out of the portfolio, the system ranks projects according to predicted risk.”

### Scene 3 — Explainability

“For this project, the model does not just say high risk. It explains why.”

### Scene 4 — Propagation

“The system then shows how the current issue can propagate into milestone delays, schedule extension and cost escalation.”

### Scene 5 — Action

“Finally, it recommends the intervention that should be prioritized.”

### Scene 6 — Intelligence

“The officer can query the project directly through the Project Intelligence Assistant.”

---

# 29. Pages to Build

### Phase 1 — Must Have

1. Login / Landing
2. Executive Dashboard
3. Project List
4. Project Intelligence Detail
5. Early Warning Center

### Phase 2 — High Value

6. Risk Propagation Network
7. Predictive Analytics
8. Benchmarking
9. Prescriptive Recommendations
10. AI Assistant

### Phase 3 — Supporting

11. Data Health
12. Model Performance
13. Settings
14. About / Methodology

---

# 30. Landing / Login

Keep it simple.

Brand:

**PAIMANA Predict**

Subtitle:

**Infrastructure Risk Intelligence & Early Warning**

Demo role selector:

- Monitoring Officer
- Senior Decision Maker
- Analyst

No real authentication is required for the prototype.

---

# 31. Data Health Page

Show:

- records processed
- missing values
- duplicate records
- stale project updates
- projects with incomplete CUF fields
- data freshness
- model readiness

Example:

```text
Projects Processed        248
Complete Records          91.4%
Missing Critical Fields    4.8%
Data Freshness            97.2%
Model Readiness            89%
```

This helps demonstrate real-world data engineering awareness.

---

# 32. Model Performance Page

Show a clean comparison.

Example:

```text
                    Statistical   ML
Cost Risk AUC          0.76       0.86
Time Risk AUC          0.74       0.84
F1 Score               0.68       0.79
Early Warning Lead     2.1 mo     4.3 mo
```

These are illustrative demo values.

Never present them as validated real-world model results.

---

# 33. API / Service Design

Keep interfaces clean.

Suggested structure:

```text
src/
  components/
  pages/
  layouts/
  charts/
  graph/
  services/
    projectService
    riskService
    alertService
    predictionService
    recommendationService
    assistantService
  data/
    projects
    monthlyMetrics
    alerts
    benchmarks
  types/
  utils/
  hooks/
```

If a backend is implemented:

```text
server/
  routes/
  controllers/
  services/
  repositories/
  models/
  data/
```

Keep frontend independent from implementation details.

---

# 34. Component Design

Create reusable components for:

- KPI card
- risk badge
- project status badge
- metric card
- risk gauge
- driver bar
- alert card
- project table
- trend chart
- prediction card
- recommendation card
- timeline
- propagation node
- benchmark card
- assistant message
- filter panel

Do not duplicate UI logic across pages.

---

# 35. Accessibility

Minimum expectations:

- keyboard accessible controls
- readable contrast
- labels on charts
- tooltips for technical metrics
- do not rely only on color to communicate risk
- tables usable without charts

---

# 36. Performance

Target:

- fast initial load
- local dataset loads instantly
- charts render smoothly
- no unnecessary polling
- no large image assets
- lazy-load heavy graph/assistant views if needed

---

# 37. Open-Source Requirement

The prototype should use open-source technologies.

Preferred:

- React
- TypeScript
- Vite
- Tailwind
- Recharts
- React Flow
- Node.js
- Express
- Python
- scikit-learn
- XGBoost / LightGBM
- FastAPI
- PostgreSQL

Do not require proprietary analytics platforms.

---

# 38. Security / Governance Notes

Since the target environment is government infrastructure monitoring, design with future security in mind.

Prototype requirements:

- no real sensitive information
- no credentials in source control
- no secrets in frontend code
- configuration via environment variables
- clear separation of roles
- audit-friendly event structure

Future considerations:

- RBAC
- SSO
- API authentication
- audit logs
- encryption
- deployment inside approved infrastructure
- model governance

---

# 39. Model Explainability Strategy

The prototype must be explainable.

Preferred future tools:

- SHAP
- feature importance
- partial dependence
- calibrated probabilities
- model comparison

For MVP:

Use a structured explanation object:

```text
driver
severity
evidence
impact
recommended_action
```

This makes the UI ready for real explainable ML.

---

# 40. No Hallucination Rule

Every AI-generated insight must be grounded in available project data.

Never allow the assistant to invent:

- project costs
- dates
- delays
- ministries
- contractor information
- official government decisions

When information is unavailable, say:

> “This information is not available in the current project dataset.”

---

# 41. Development Phases

## Phase 0 — Understand & Setup

Antigravity must:

1. inspect the repository
2. identify existing code
3. identify framework
4. preserve useful existing work
5. read this PLAN.md completely
6. create a short implementation plan
7. identify missing dependencies

Do not rewrite the entire project without reason.

---

## Phase 1 — Working Shell

Build:

- layout
- sidebar
- top bar
- routing
- theme
- responsive container
- seeded demo data
- shared components

Acceptance:

The app launches successfully and every major page is routable.

---

## Phase 2 — Dashboard

Build:

- KPI cards
- charts
- risk distribution
- high-risk projects
- filters
- portfolio summary

Acceptance:

A user can understand the health of the portfolio in under 10 seconds.

---

## Phase 3 — Project Intelligence

Build:

- project list
- project detail
- risk score
- cost prediction
- time prediction
- driver explanation
- milestones
- trends

Acceptance:

One project can be fully investigated without leaving the product context.

---

## Phase 4 — Early Warning

Build:

- alert center
- alert lifecycle
- severity
- trigger explanation
- lead time
- recommended action

Acceptance:

A user can identify and acknowledge a warning.

---

## Phase 5 — Risk Propagation

Build:

- interactive graph
- dependency nodes
- downstream effects
- severity
- mitigation

Acceptance:

A user can visually understand how one issue leads to another.

---

## Phase 6 — Decision Support

Build:

- recommendation engine
- benchmarking
- predictive model comparison
- CUF vs expanded variable analysis

Acceptance:

The product answers “what should we do?” and “why?”

---

## Phase 7 — AI Assistant

Build:

- assistant UI
- question suggestions
- grounded project lookup
- answer generation
- evidence references

Acceptance:

The assistant can answer at least 10 predefined project questions from local data.

---

## Phase 8 — Demo Hardening

Check:

- no broken routes
- no console errors
- no missing assets
- realistic data
- consistent labels
- loading states
- empty states
- responsive behavior
- clean charts
- demo flow

---

# 42. Antigravity Working Rules

Antigravity should follow these rules during implementation.

### Rule 1
**Build working software before polishing.**

### Rule 2
**Do not implement fake complexity when simple deterministic logic is enough for the prototype.**

### Rule 3
**Do not claim that demo metrics are real model performance.**

### Rule 4
**Do not depend on unavailable external APIs for the core demo.**

### Rule 5
**Keep data, business logic, and UI separate.**

### Rule 6
**Make all important prototype behavior replaceable by real services later.**

### Rule 7
**Use reusable components.**

### Rule 8
**Avoid unnecessary dependencies.**

### Rule 9
**Keep every page presentation-ready.**

### Rule 10
**After each phase, run the application and verify the implemented flow.**

---

# 43. Acceptance Criteria

The prototype is considered successful when:

### Functional

- dashboard loads
- project search works
- project filters work
- project detail works
- risk scores calculate
- predictions display
- drivers display
- alerts display
- propagation graph works
- recommendations display
- benchmarking works
- assistant answers grounded demo questions

### Visual

- no broken layout
- consistent typography
- consistent spacing
- professional government/enterprise appearance
- readable charts
- clear risk hierarchy

### Technical

- TypeScript has no avoidable errors
- no major console errors
- reusable architecture
- seed data separated from UI
- prediction logic separated from presentation
- easy future replacement with real ML/API

### Demo

The full story must be demonstrable in:

**60–120 seconds**

---

# 44. Future Production Architecture

The prototype should leave room for:

```text
PAIMANA APIs
     ↓
Data Ingestion
     ↓
Data Validation
     ↓
Data Lake / Warehouse
     ↓
Feature Store
     ↓
ML Pipeline
     ↓
Model Registry
     ↓
Inference API
     ↓
Risk Engine
     ↓
Recommendation Engine
     ↓
Alert Engine
     ↓
PAIMANA Predict UI
     ↓
LLM Assistant
```

Potential production components:

- PostgreSQL
- object storage
- Airflow
- Kafka
- Spark
- FastAPI
- MLflow
- Redis
- vector database
- open-source LLM
- monitoring/logging

Do not build the full production architecture now.

---

# 45. Future ML Roadmap

### Stage 1

Statistical baseline:

- Logistic Regression
- Linear Regression

### Stage 2

Classical ML:

- Random Forest
- Gradient Boosting
- XGBoost / LightGBM

### Stage 3

Time-dependent modelling:

- time-series forecasting
- survival analysis
- temporal models

### Stage 4

Explainability:

- SHAP
- feature attribution
- calibration
- confidence intervals

### Stage 5

Prescriptive analytics:

- intervention simulation
- scenario analysis
- optimization

---

# 46. Future LLM Roadmap

Use an open-source LLM where feasible.

Architecture:

```text
User Question
     ↓
Intent Detection
     ↓
Project / Metric Retrieval
     ↓
Evidence Context
     ↓
LLM
     ↓
Grounded Answer
     ↓
Source / Evidence Panel
```

Potential future capabilities:

- monthly project brief generation
- executive summaries
- cross-project comparisons
- issue extraction
- meeting/action summaries
- natural-language analytics
- policy-level portfolio questions

---

# 47. Suggested Demo Questions

Seed the assistant with these:

1. Why is PJ-1042 high risk?
2. What is driving the predicted delay?
3. Which projects are most likely to exceed cost?
4. Which sector currently has the highest risk?
5. What project should be prioritized first?
6. What are the main implementation bottlenecks?
7. How does PJ-1042 compare with peers?
8. What additional variables would improve prediction?
9. What is the projected delay for PJ-1042?
10. What intervention is recommended?

---

# 48. Presentation-Focused Features

At least one dashboard card should communicate:

> **“Preventable Risk Identified”**

Example:

```text
34 Critical Projects
↓
12 High-confidence early warnings
↓
Estimated exposure:
₹1,240 Cr + 38 months
```

These are synthetic demonstration numbers.

The purpose is to communicate the value of early intervention.

---

# 49. Core Value Proposition

Everything in the prototype should reinforce this:

### Existing monitoring

**What happened?**

### Proposed intelligence

**What is likely to happen?**

### Explainability

**Why is it likely to happen?**

### Risk propagation

**What happens next?**

### Prescriptive analytics

**What should we do now?**

This is the central story of the product.

---

# 50. Final Build Priority

When time is limited, prioritize exactly in this order:

```text
1. Dashboard
2. Project Intelligence
3. Risk Scoring
4. Early Warnings
5. Risk Propagation
6. Recommendations
7. Predictive Analytics
8. Benchmarking
9. AI Assistant
10. Supporting pages
```

Do not sacrifice the first five for extra features.

---

# 51. First Antigravity Instruction

After reading this PLAN.md, Antigravity should:

1. Inspect the existing project/repository.
2. Identify the current stack and reusable code.
3. Create/update the project structure without destroying useful work.
4. Implement Phase 1 and Phase 2 first.
5. Generate realistic synthetic PAIMANA-like demo data.
6. Build the dashboard and project intelligence flow.
7. Run the application.
8. Fix build/runtime errors.
9. Verify the primary 60–120 second demo journey.
10. Stop and report:
   - what was implemented
   - files changed
   - current status
   - remaining work
   - any blockers

Do not jump directly into a full production ML implementation.

---

# 52. Definition of Done for the First Iteration

The first iteration is complete when a user can:

```text
Launch app
   ↓
View portfolio risk
   ↓
Find a critical project
   ↓
Open project intelligence
   ↓
See predicted cost/time risk
   ↓
Understand risk drivers
   ↓
View recommended intervention
```

Only after this works should advanced modules be added.

---

## Final Product Principle

**Do not build a dashboard that merely displays project data.**

Build a prototype that demonstrates a clear intelligence loop:

> **Detect early → predict impact → explain cause → trace propagation → recommend intervention.**

That is the core product idea Antigravity should optimize for.
