# PAIMANA Predict — Machine Learning Methodology & Governance

## 1. Executive Summary & Generational Lineage

PAIMANA Predict maintains a strict scientific separation between two generations of machine learning research:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PAIMANA PREDICT MODEL GENERATIONS                                       │
├──────────────────────────┬────────────────────────────────────────┬─────────────────────────────────────┤
│ Dimension                │ Generation 2 (Governed Production)     │ Generation 1 (Synthetic AI Demo)    │
├──────────────────────────┼────────────────────────────────────────┼─────────────────────────────────────┤
│ Model Identifier         │ time-gbm-v1.4 (APPROVED)               │ time-gbm-demo-v1 (SIMULATION ONLY)  │
│ Underlying Dataset       │ Authentic Historical PAIMANA Data      │ Synthetic Research Demonstration    │
│ Sample Size              │ 1,981 Real Projects (10 Snapshots)     │ 241 Simulated Project Records       │
│ Validation Methodology   │ Strict Temporal Holdout (Rule T)       │ 5-Fold Stratified Cross-Validation  │
│ Forecast Horizon         │ Explicit 90 Days (3 Snapshot Cycles)   │ Static 6-Month Horizon              │
│ Primary ROC-AUC          │ 0.8850 (vs 0.7551 Baseline LR)         │ 0.916 (Synthetic Research Bound)    │
│ Probability Calibration  │ Brier Score = 0.1714 (Platt Scaled)    │ Uncalibrated Raw Sigmoid            │
│ Target Decision Boundary │ θ = 0.45 (Recall-Prioritized)          │ θ = 0.50 (Default)                  │
│ Operational Usage        │ Production Inference & Early Warnings  │ Counterfactual What-If Simulation   │
└──────────────────────────┴────────────────────────────────────────┴─────────────────────────────────────┘
```

---

## 2. Governed Production Temporal Model (`time-gbm-v1.4`)

### A. Strict Anti-Temporal Leakage Policy (Rule T)
For any prediction evaluated as of snapshot timestamp $T$:
- **Feature Inputs**: Computed **strictly from snapshots at or prior to $T$ ($t \le T$)**.
- **Prediction Target**: Computed **strictly from observations occurring at $t > T$**.
- Under no circumstances may future revised costs, completion dates, or expenditures be used to predict an earlier state.

### B. Temporal Dataset Partitioning
Records are partitioned chronologically by cutoff timestamp:
- **Training Set (1,489 obs)**: October 2025 $\rightarrow$ January 2026
- **Validation Set (2,772 obs)**: February 2026 $\rightarrow$ March 2026
- **Test Set (5,289 obs)**: April 2026 $\rightarrow$ July 2026

### C. Target Definitions & Forecast Horizons
1. **`adverse_deterioration_event` (v1.2, Classification)**:
   - **Forecast Horizon**: **$90\text{ Days}$** (up to 3 consecutive monthly reporting snapshots).
   - **Event Criteria**: Project experiences completion date postponement or monthly physical progress velocity $< 0.5\%/\text{month}$ in subsequent snapshots.
2. **`cost_escalation_growth_pct` (v1.2, Regression)**:
   - **Forecast Horizon**: **$180\text{ Days}$** (up to 6 consecutive monthly reporting snapshots).
   - **Target**: Observed percentage growth in revised anticipated cost over baseline at cutoff $T$.

### D. Audited Performance Metrics

#### Classification Benchmark (`time-gbm-v1.4` vs Baseline):
| Metric | Governed Temporal GBM (`v1.4`) | Baseline Logistic Regression | Evaluation Set / Notes |
| :--- | :--- | :--- | :--- |
| **ROC-AUC** | **0.8850** | 0.7551 | $+0.130$ AUC Discriminative Gain |
| **Brier Score** | **0.1714** | 0.2198 | Verified Probability Calibration ($<0.20$) |
| **Precision** | **88.4%** | 76.2% | At Governed Threshold $\theta = 0.45$ |
| **Recall** | **91.2%** | 78.1% | High Sensitivity for Early Warning |
| **F1-Score** | **89.8%** | 77.1% | Balanced Performance Metric |
| **Accuracy** | **89.2%** | 77.8% | Overall Test Accuracy |
| **Class Distribution**| **57.3% Positive / 42.7% Negative** | — | Balanced Empirical Pacing |

#### Regression Benchmark (`cost-gbm-v1.4`):
- **Mean Absolute Error (MAE)**: **$2.33\%$**
- **Root Mean Squared Error (RMSE)**: **$11.11\%$**
- **Coefficient of Determination ($R^2$)**: **$0.7000$**
- **Median Absolute Error**: **$2.60\%$**

#### Unsupervised Trajectory Anomaly Detection (`anomaly-iforest-v1.0`):
- **Methodology**: Isolation Forest (Empirical Trajectory Outlier Profiling)
- **Contamination Rate**: $10.0\%$
- **Percentage Flagged**: **$9.8\%$** across 2,185 project series
- **Downstream Overlap**: **$82.4\%$** qualitative alignment with future stagnation

---

## 3. Authoritative Historical Backtesting & Lead Time Evidence

Backtest Run: `BT-20260902-TGBM14` (Evaluated across 2,185 project trajectories across 10 snapshot periods):

- **Mean Advance Warning Lead Time**: **$4.3\text{ Months}$**
- **Median Advance Warning Lead Time**: **$4.0\text{ Months}$**
- **25th Percentile ($p_{25}$)**: **$2.0\text{ Months}$**
- **75th Percentile ($p_{75}$)**: **$4.5\text{ Months}$**
- **Adverse Event Detection Rate**: **$91.2\%$**
- **False Warning Rate**: **$8.4\%$**
- **Miss Rate**: **$8.8\%$**
- **Precedence Enforcement**: $\text{warning\_date} < \text{event\_date}$ strictly enforced for all lead time observations.

---

## 4. Feature Importance Lineage

### Governed Production Model (`time-gbm-v1.4`):
1. **1-Month Progress Velocity ($\Delta P / \text{mo}$)**: $24.0\%$
2. **Progress Momentum (Acceleration / Deceleration)**: $18.0\%$
3. **Consecutive Stagnation Chain ($\Delta P < 0.5\%$)**: $15.0\%$
4. **Current Physical Progress Baseline (%)**: $14.0\%$
5. **3-Month Moving Progress Velocity**: $11.0\%$
6. **Expenditure / Progress Decoupling Alignment**: $7.0\%$
7. **Observed Cost Growth Revision (%)**: $4.0\%$
8. **Historical Progress Volatility ($\sigma$)**: $2.0\%$

### Legacy Synthetic Research Benchmark (`time-gbm-demo-v1`):
1. **Progress Gap (Planned - Physical %)**: $60.5\%$
2. **Right-of-Way Land Handover (%)**: $9.4\%$
3. **Statutory Clearances Pacing Score**: $7.8\%$
4. **Cumulative Financial Utilization**: $6.2\%$

---

## 5. Model Lifecycle & Governance Statuses

Model transitions follow 6 governed lifecycle states:
$$\text{TRAINED} \longrightarrow \text{VALIDATED} \longrightarrow \text{CANDIDATE} \longrightarrow \text{APPROVED} \longrightarrow \text{DEPLOYED} \longrightarrow \text{RETIRED}$$
- Only **`APPROVED`** models are deployed to `/api/v1/predictions` inference endpoints.
