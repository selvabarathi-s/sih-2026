#!/usr/bin/env python3
"""
PAIMANA PREDICT: TEMPORAL ML & ANTI-LEAKAGE VERIFICATION SUITE
Verifies strict temporal cutoff (Rule T), feature generation, and model evaluation metrics.
Smart India Hackathon 2026 • Problem Statement 26103
"""

import os
import sys
import json
import subprocess
import time
import urllib.request
import urllib.error

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

TEST_PORT = 5098
BASE_URL = f"http://127.0.0.1:{TEST_PORT}"

def make_request(path, method="GET", body=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        res_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(res_body)
        except Exception:
            return e.code, {"raw": res_body}
    except Exception as e:
        return 500, {"error": str(e)}

def run_tests():
    print("=" * 75)
    print("PAIMANA PREDICT: TEMPORAL ML & ANTI-LEAKAGE VERIFICATION SUITE")
    print("=" * 75)

    # 1. Verify Model Artifact Files exist
    model_artifact = os.path.join("ml", "artifacts", "time", "time_gbm_model.json")
    backtest_artifact = os.path.join("ml", "artifacts", "backtesting_results.json")
    feat_artifact = os.path.join("ml", "artifacts", "feature_availability.json")

    assert os.path.exists(model_artifact), "time_gbm_model.json not found in ml/artifacts/time"
    assert os.path.exists(backtest_artifact), "backtesting_results.json not found in ml/artifacts"
    assert os.path.exists(feat_artifact), "feature_availability.json not found in ml/artifacts"
    print("TEST 1: Persistent model artifacts verified in ml/artifacts/ -> PASS")

    with open(model_artifact, "r", encoding="utf-8") as f:
        model_data = json.load(f)

    metrics = model_data.get("classification_metrics") or model_data.get("metrics", {})
    assert metrics.get("roc_auc", 0) >= 0.85, f"ROC-AUC too low: {metrics.get('roc_auc')}"
    assert metrics.get("baseline_lr_auc", 0) >= 0.70, f"Baseline LR AUC too low"
    print(f"TEST 2: Model Performance Metrics Verified (GBM AUC = {metrics.get('roc_auc')}, Baseline LR = {metrics.get('baseline_lr_auc')}) -> PASS")

    # 2. Verify Feature Availability Matrix
    with open(feat_artifact, "r", encoding="utf-8") as f:
        feats = json.load(f)

    real_feats = [f for f in feats if f["real_paimana"]]
    prohibited_feats = [f for f in feats if not f["real_paimana"]]
    assert len(real_feats) >= 5, "Fewer than 5 real features"
    assert len(prohibited_feats) >= 3, "Prohibited features not explicitly documented"
    print(f"TEST 3: Feature Availability Matrix Verified ({len(real_feats)} Real, {len(prohibited_feats)} Prohibited/Demo) -> PASS")

    # 3. Test Live Inference Endpoints over REST API
    env = os.environ.copy()
    env["PORT"] = str(TEST_PORT)
    env["NODE_ENV"] = "test"
    
    server_proc = subprocess.Popen(
        ["node", "server.js"],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=os.getcwd()
    )
    time.sleep(2)

    try:
        # Test GET /api/v1/predictions/PAI-706775?asOfDate=2026-01
        status, pred_res = make_request("/api/v1/predictions/PAI-706775?asOfDate=2026-01")
        assert status == 200, f"Prediction endpoint failed: {pred_res}"
        data = pred_res.get("data", {})
        time_risk = data.get("timeRisk", {})
        assert time_risk.get("predictedProbability") is not None, "Missing predictedProbability"
        assert time_risk.get("asOfDate") == "January 2026" or time_risk.get("asOfDate") == "2026-01", f"As of date mismatch: {time_risk.get('asOfDate')}"
        
        # Test Strict Anti-Leakage: featuresUsed must ONLY contain snapshots <= 2026-01
        history_dates = time_risk.get("featuresUsed", {}).get("historySnapshotDates", [])
        for d in history_dates:
            assert d in ["October 2025", "November 2025", "December 2025", "January 2026"], f"Temporal Leakage detected: snapshot {d} found for cutoff 2026-01!"
        print(f"TEST 4: Strict Temporal Anti-Leakage (Rule T) Verified (Cutoff: Jan 2026, History: {history_dates}) -> PASS")

        # Test GET /api/v1/models
        status, models_res = make_request("/api/v1/models")
        assert status == 200, f"Models listing failed: {models_res}"
        assert len(models_res.get("data", [])) >= 3, "Missing models in registry"
        print(f"TEST 5: /api/v1/models Registry Endpoint Verified ({len(models_res.get('data'))} registered models) -> PASS")

        # Test GET /api/v1/predictions/PAI-706775/prescription
        status, presc_res = make_request("/api/v1/predictions/PAI-706775/prescription")
        assert status == 200, f"Prescription endpoint failed: {presc_res}"
        presc = presc_res.get("data", {})
        assert len(presc.get("recommendedActions", [])) > 0, "No recommended actions"
        print(f"TEST 6: Prescriptive Decision Support API Verified (Priority: {presc.get('priority')}) -> PASS")

    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=3)
        except Exception:
            server_proc.kill()

    print("=" * 75)
    print("ALL TEMPORAL ML & ANTI-LEAKAGE TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
