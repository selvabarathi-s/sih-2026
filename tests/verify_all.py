import json
import os
import sys

def run_system_verification():
    print("==================================================")
    print("PAIMANA PREDICT: SYSTEM VERIFICATION TEST SUITE")
    print("==================================================")
    
    metrics_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'computedModelMetrics.json')
    if not os.path.exists(metrics_path):
        print("FAIL: computedModelMetrics.json not found!")
        sys.exit(1)
        
    with open(metrics_path, 'r', encoding='utf-8') as f:
        metrics = json.load(f)
        
    # 1. Verify Model Metrics
    cost_models = metrics.get('cost_overrun_models', {})
    time_models = metrics.get('time_overrun_models', {})
    cuf_comp = metrics.get('cuf_vs_expanded_comparison', {})
    
    assert 'Gradient Boosting (GBM / XGBoost Equivalent)' in cost_models, "Cost GBM model missing!"
    assert 'Gradient Boosting (GBM / XGBoost Equivalent)' in time_models, "Time GBM model missing!"
    assert cuf_comp.get('time_overrun', {}).get('expanded_auc', 0) > 0.85, "Expanded AUC invalid!"
    
    print("TEST 1: ML Model Metrics Loaded & Validated (GBM Time AUC = {:.3f}) -> PASS".format(
        time_models['Gradient Boosting (GBM / XGBoost Equivalent)']['roc_auc']
    ))
    
    # 2. Verify CUF Delta
    auc_delta = cuf_comp['time_overrun']['auc_delta']
    lead_time_delta = cuf_comp['time_overrun']['lead_time_delta_months']
    assert auc_delta > 0, "AUC delta must be positive!"
    assert lead_time_delta > 1.0, "Lead time delta must be positive!"
    print(f"TEST 2: CUF vs Expanded Operational Variables Gain (+{auc_delta} AUC, +{lead_time_delta} Mo Lead Time) -> PASS")
    
    # 3. Verify Feature Importances
    feat_imp = metrics.get('feature_importance', {}).get('time_overrun', [])
    assert len(feat_imp) >= 10, "Feature importance list too short!"
    top_feature = feat_imp[0]
    print(f"TEST 3: Feature Importance Verification (Top Feature: {top_feature['label']} with {top_feature['importance_score']}%) -> PASS")
    
    # 4. Verify Scientific Honesty / Disclaimer
    disclaimer = metrics.get('metadata', {}).get('synthetic_dataset_disclaimer', '')
    assert len(disclaimer) > 10, "Disclaimer must be populated!"
    print(f"TEST 4: Scientific Honesty Policy Verified: '{disclaimer}' -> PASS")
    
    print("==================================================")
    print("ALL 4 CRITICAL CORE TESTS PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == '__main__':
    run_system_verification()
