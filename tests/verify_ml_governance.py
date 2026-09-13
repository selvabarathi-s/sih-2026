#!/usr/bin/env python3
"""
PAIMANA PREDICT: ML GOVERNANCE & MODEL CARDS VERIFICATION SUITE
Verifies model cards, lineage, lifecycle status (APPROVED), and strict separation of classification and regression metrics.
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

TEST_PORT = 5095
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
    print("PAIMANA PREDICT: ML GOVERNANCE & MODEL CARDS VERIFICATION SUITE")
    print("=" * 75)

    # 1. Verify Model Cards exist on disk
    time_card_path = os.path.join("ml", "artifacts", "cards", "time_gbm_v1.4_card.json")
    cost_card_path = os.path.join("ml", "artifacts", "cards", "cost_gbm_v1.4_card.json")

    assert os.path.exists(time_card_path), "time_gbm_v1.4_card.json missing"
    assert os.path.exists(cost_card_path), "cost_gbm_v1.4_card.json missing"

    with open(time_card_path, "r", encoding="utf-8") as f:
        time_card = json.load(f)
    with open(cost_card_path, "r", encoding="utf-8") as f:
        cost_card = json.load(f)

    # 2. Verify Lineage and Status
    assert time_card.get("model_status") == "APPROVED", "Time model status must be APPROVED"
    assert cost_card.get("model_status") == "APPROVED", "Cost model status must be APPROVED"
    assert time_card.get("target_type") == "CLASSIFICATION", "Time target must be CLASSIFICATION"
    assert cost_card.get("target_type") == "REGRESSION", "Cost target must be REGRESSION"
    assert "classification_metrics" in time_card, "Classification metrics missing"
    assert "regression_metrics" in cost_card, "Regression metrics missing"
    print("TEST 1: Model Cards Lineage & Metric Separation Verified (Time=Classification, Cost=Regression) -> PASS")

    # 3. Test REST API Model Card and Drift Endpoints
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
        status, card_res = make_request("/api/v1/models/time-gbm-v1.4/card")
        assert status == 200, f"Model card API failed: {card_res}"
        card_data = card_res.get("data", {})
        assert card_data.get("model_id") == "time-gbm-v1.4", "Model ID mismatch"
        assert card_data.get("target_definition", {}).get("forecast_horizon_days") == 90, "Forecast horizon missing"
        print(f"TEST 2: GET /api/v1/models/:id/card Endpoint Verified (Status: {card_data.get('model_status')}) -> PASS")

        status, drift_res = make_request("/api/v1/models/drift/report")
        assert status == 200, f"Drift report API failed: {drift_res}"
        drift_data = drift_res.get("data", {})
        assert "feature_distributions" in drift_data or "featureDistributions" in drift_data, "Feature distributions missing"
        print(f"TEST 3: GET /api/v1/models/drift/report Verified (PSI Monitoring Active) -> PASS")
    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=3)
        except Exception:
            server_proc.kill()

    print("=" * 75)
    print("ALL ML GOVERNANCE TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
