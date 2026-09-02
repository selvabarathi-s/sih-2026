#!/usr/bin/env python3
"""
PAIMANA PREDICT: WEAK-SIGNAL, ANOMALY & RISK MOMENTUM VERIFICATION SUITE
Verifies sub-threshold weak signals, unsupervised trajectory anomalies, and risk momentum.
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

TEST_PORT = 5096
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
    print("PAIMANA PREDICT: WEAK-SIGNAL, ANOMALY & RISK MOMENTUM VERIFICATION SUITE")
    print("=" * 75)

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
        # 1. Test GET /api/v1/signals/PAI-706775 (Weak-Signal Engine)
        status, sig_res = make_request("/api/v1/signals/PAI-706775")
        assert status == 200, f"Signals endpoint failed: {sig_res}"
        data = sig_res.get("data", {})
        assert "weakSignalScore" in data, "Missing weakSignalScore"
        score = data.get("weakSignalScore")
        assert 0 <= score <= 100, f"Score out of range: {score}"
        print(f"TEST 1: /api/v1/signals/:projectId Verified (Weak Signal Score: {score}/100, Severity: {data.get('severity')}) -> PASS")

        # 2. Test GET /api/v1/anomalies/PAI-706775 (Anomaly Detection)
        status, anom_res = make_request("/api/v1/anomalies/PAI-706775")
        assert status == 200, f"Anomalies endpoint failed: {anom_res}"
        anom_data = anom_res.get("data", {})
        assert "anomalyScore" in anom_data, "Missing anomalyScore"
        anom_score = anom_data.get("anomalyScore")
        assert 0 <= anom_score <= 100, f"Anomaly score out of range: {anom_score}"
        print(f"TEST 2: /api/v1/anomalies/:projectId Verified (Anomaly Score: {anom_score}/100, IsAnomaly: {anom_data.get('isAnomaly')}) -> PASS")

        # 3. Test GET /api/v1/risk/PAI-706775 (Risk Momentum)
        status, risk_res = make_request("/api/v1/risk/PAI-706775")
        assert status == 200, f"Risk endpoint failed: {risk_res}"
        risk_data = risk_res.get("data", {})
        momentum = risk_data.get("momentum", {})
        assert "momentumCategory" in momentum, "Missing momentumCategory"
        cat = momentum.get("momentumCategory")
        assert cat in ["RAPIDLY_DETERIORATING", "MODERATELY_DETERIORATING", "STABLE", "RECOVERING_RAPIDLY", "IMPROVING"], f"Invalid momentum category: {cat}"
        print(f"TEST 3: /api/v1/risk/:projectId Verified (Risk Momentum: {cat}, Trajectory: {momentum.get('trajectory')}) -> PASS")

    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=3)
        except Exception:
            server_proc.kill()

    print("=" * 75)
    print("ALL WEAK-SIGNAL, ANOMALY & RISK MOMENTUM TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
