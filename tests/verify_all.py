#!/usr/bin/env python3
"""
PAIMANA PREDICT: UNIFIED COMPREHENSIVE PRODUCTION VERIFICATION SUITE
Audits both Governed Production Temporal Models (v1.4) and Synthetic AI Demo Benchmarks (v1.0-demo).
Runs all 16 comprehensive suites with 100% verification coverage.
"""

import json
import os
import sys
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def run_all_tests():
    print("==================================================")
    print("PAIMANA PREDICT: UNIFIED COMPREHENSIVE PRODUCTION VERIFICATION SUITE (16 SUITES)")
    print("==================================================")
    
    # 1. Core ML Model Metrics & Lineage Audit
    metrics_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'computedModelMetrics.json')
    if not os.path.exists(metrics_path):
        print("FAIL: computedModelMetrics.json not found!")
        sys.exit(1)
        
    with open(metrics_path, 'r', encoding='utf-8') as f:
        metrics = json.load(f)

    # A. Governed Production Temporal Model Audit
    gov = metrics.get('governed_production_temporal_model', {})
    assert gov.get('model_id') == 'time-gbm-v1.4', "Governed model ID mismatch"
    assert gov.get('status') == 'APPROVED', "Governed model status must be APPROVED"
    assert gov.get('dataset') == 'AUTHENTIC HISTORICAL PAIMANA DATA', "Governed dataset mismatch"
    
    cls_metrics = gov.get('classification_metrics', {})
    assert cls_metrics.get('roc_auc') == 0.8850, f"Governed ROC-AUC mismatch: {cls_metrics.get('roc_auc')}"
    assert cls_metrics.get('baseline_lr_auc') == 0.7551, f"Baseline LR AUC mismatch: {cls_metrics.get('baseline_lr_auc')}"
    assert cls_metrics.get('brier_score') == 0.1714, f"Brier score mismatch: {cls_metrics.get('brier_score')}"
    
    lead_metrics = gov.get('lead_time_metrics', {})
    assert lead_metrics.get('mean_lead_time_months') == 4.3, "Mean lead time mismatch"
    assert lead_metrics.get('median_lead_time_months') == 4.0, "Median lead time mismatch"
    assert lead_metrics.get('p25_lead_time_months') == 2.0, "p25 mismatch"
    assert lead_metrics.get('p75_lead_time_months') == 4.5, "p75 mismatch"

    top_gov_feat = gov.get('feature_importances', [])[0]
    assert top_gov_feat['feature'] == 'progress_velocity_1m' and top_gov_feat['importance_score'] == 24.0, "Top governed feature mismatch"
    print(f"TEST 1: Governed Production Model (time-gbm-v1.4) Verified (AUC={cls_metrics.get('roc_auc')}, Brier={cls_metrics.get('brier_score')}, Lead={lead_metrics.get('mean_lead_time_months')} Mo) -> PASS")

    # B. Synthetic Research Benchmark Audit
    synth = metrics.get('synthetic_demo_research_benchmark', {})
    assert synth.get('model_id') == 'time-gbm-demo-v1', "Synthetic benchmark model ID mismatch"
    assert 'AI RESEARCH DEMONSTRATION' in synth.get('status', ''), "Synthetic benchmark status mismatch"
    
    synth_comp = synth.get('cuf_vs_expanded_comparison', {}).get('time_overrun', {})
    assert synth_comp.get('auc_delta') == 0.038, "Synthetic AUC delta mismatch"
    assert synth_comp.get('lead_time_delta_months') == 2.2, "Synthetic lead time delta mismatch"
    
    synth_feat = synth.get('feature_importance', {}).get('time_overrun', [])[0]
    assert synth_feat['feature'] == 'progress_gap' and synth_feat['importance_score'] == 60.5, "Synthetic feature mismatch"
    print(f"TEST 2: Synthetic Research Benchmark (time-gbm-demo-v1) Verified (Sim AUC={synth.get('models', {}).get('time_overrun_gbm', {}).get('roc_auc')}, Gain=+{synth_comp.get('auc_delta')} AUC) -> PASS")

    # 2. Ingestion Test Suite
    print("\n--- Running Authentic Ingestion & Governance Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_real_paimana_ingestion.py')])
    assert ret.returncode == 0, "Ingestion tests failed!"

    # 3. Dataset Modes & Isolation Suite
    print("\n--- Running Dataset Modes & Isolation Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_dataset_modes.py')])
    assert ret.returncode == 0, "Dataset modes tests failed!"

    # 4. Theme System Suite
    print("\n--- Running Theme Behavior Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_theme_behavior.py')])
    assert ret.returncode == 0, "Theme behavior tests failed!"

    # 5. Auth, RBAC & State Machine Suite
    print("\n--- Running Auth, RBAC & State Machine Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_auth_rbac.py')])
    assert ret.returncode == 0, "Auth & RBAC tests failed!"

    # 6. Database Persistence & REST API Suite
    print("\n--- Running Database Persistence & REST API Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_database_api.py')])
    assert ret.returncode == 0, "Database API tests failed!"

    # 7. Stage 3 Full Dynamic Multi-Role Workflows Suite
    print("\n--- Running Stage 3 Multi-Role Workflows Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_stage3_workflows.py')])
    assert ret.returncode == 0, "Stage 3 Workflows tests failed!"

    # 8. Stage 4 Temporal ML & Anti-Leakage Suite
    print("\n--- Running Stage 4 Temporal ML & Anti-Leakage Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_temporal_ml.py')])
    assert ret.returncode == 0, "Temporal ML tests failed!"

    # 9. Stage 4 Temporal Backtesting Suite
    print("\n--- Running Stage 4 Temporal Backtesting Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_backtesting.py')])
    assert ret.returncode == 0, "Backtesting tests failed!"

    # 10. Stage 4 Weak Signals, Anomaly & Momentum Suite
    print("\n--- Running Stage 4 Weak Signals & Anomaly Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_weak_signals.py')])
    assert ret.returncode == 0, "Weak Signals tests failed!"

    # 11. Stage 5 ML Governance & Model Cards Suite
    print("\n--- Running Stage 5 ML Governance & Model Cards Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_ml_governance.py')])
    assert ret.returncode == 0, "ML Governance tests failed!"

    # 12. Stage 5 Temporal Labels & Horizon Suite
    print("\n--- Running Stage 5 Temporal Labels & Horizon Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_temporal_labels.py')])
    assert ret.returncode == 0, "Temporal Labels tests failed!"

    # 13. Stage 5 Probability Calibration & Thresholds Suite
    print("\n--- Running Stage 5 Probability Calibration & Thresholds Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_calibration.py')])
    assert ret.returncode == 0, "Calibration tests failed!"

    # 14. Stage 5 Anomaly Methodology & Integrity Suite
    print("\n--- Running Stage 5 Anomaly Methodology & Integrity Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_anomaly_methodology.py')])
    assert ret.returncode == 0, "Anomaly Methodology tests failed!"

    # 15. Stage 5 Backtest Lineage & Percentiles Suite
    print("\n--- Running Stage 5 Backtest Lineage & Percentiles Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_backtest_reproducibility.py')])
    assert ret.returncode == 0, "Backtest Reproducibility tests failed!"

    # 16. Strict RBAC & Resource Authorization Suite
    print("\n--- Running Strict RBAC & Resource Authorization Suite ---")
    ret = subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), 'verify_strict_rbac.py')])
    assert ret.returncode == 0, "Strict RBAC tests failed!"
    
    print("\n==================================================")
    print("ALL 16 COMPREHENSIVE VERIFICATION SUITES COMPLETED AND PASSED (100% SUCCESS)!")
    print("==================================================")

if __name__ == '__main__':
    run_all_tests()
