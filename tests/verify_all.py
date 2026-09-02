#!/usr/bin/env python3
"""
PAIMANA PREDICT: UNIFIED COMPREHENSIVE PRODUCTION VERIFICATION SUITE
Runs all 15 test suites covering Ingestion, Governance, Multi-Role Workflows, Temporal ML, Anti-Leakage, Calibration, and Anomaly Integrity.
"""

import json
import os
import sys
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def run_all_tests():
    print("==================================================")
    print("PAIMANA PREDICT: UNIFIED COMPREHENSIVE PRODUCTION VERIFICATION SUITE (15 SUITES)")
    print("==================================================")
    
    # 1. Core ML Model Metrics & Benchmarks
    metrics_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'computedModelMetrics.json')
    if not os.path.exists(metrics_path):
        print("FAIL: computedModelMetrics.json not found!")
        sys.exit(1)
        
    with open(metrics_path, 'r', encoding='utf-8') as f:
        metrics = json.load(f)
        
    cost_models = metrics.get('cost_overrun_models', {})
    time_models = metrics.get('time_overrun_models', {})
    cuf_comp = metrics.get('cuf_vs_expanded_comparison', {})
    
    assert 'Gradient Boosting (GBM / XGBoost Equivalent)' in cost_models, "Cost GBM model missing!"
    assert 'Gradient Boosting (GBM / XGBoost Equivalent)' in time_models, "Time GBM model missing!"
    assert cuf_comp.get('time_overrun', {}).get('expanded_auc', 0) > 0.85, "Expanded AUC invalid!"
    
    print("TEST 1: ML Model Metrics Loaded & Validated (GBM Time AUC = {:.3f}) -> PASS".format(
        time_models['Gradient Boosting (GBM / XGBoost Equivalent)']['roc_auc']
    ))
    
    auc_delta = cuf_comp['time_overrun']['auc_delta']
    lead_time_delta = cuf_comp['time_overrun']['lead_time_delta_months']
    assert auc_delta > 0, "AUC delta must be positive!"
    assert lead_time_delta > 1.0, "Lead time delta must be positive!"
    print(f"TEST 2: CUF vs Expanded Operational Variables Gain (+{auc_delta} AUC, +{lead_time_delta} Mo Lead Time) -> PASS")
    
    feat_imp = metrics.get('feature_importance', {}).get('time_overrun', [])
    assert len(feat_imp) >= 10, "Feature importance list too short!"
    top_feature = feat_imp[0]
    print(f"TEST 3: Feature Importance Verification (Top Feature: {top_feature['label']} with {top_feature['importance_score']}%) -> PASS")
    
    disclaimer = metrics.get('metadata', {}).get('synthetic_dataset_disclaimer', '')
    assert len(disclaimer) > 10, "Disclaimer must be populated!"
    print(f"TEST 4: Scientific Honesty Policy Verified: '{disclaimer}' -> PASS")

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
    
    print("\n==================================================")
    print("ALL 15 COMPREHENSIVE VERIFICATION SUITES COMPLETED AND PASSED (100% SUCCESS)!")
    print("==================================================")

if __name__ == '__main__':
    run_all_tests()
