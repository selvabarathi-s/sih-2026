#!/usr/bin/env python3
"""
PAIMANA PREDICT: TEMPORAL BACKTESTING VERIFICATION SUITE
Verifies multi-period historical backtesting, lead time distribution, and detection efficacy.
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

TEST_PORT = 5097
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
    print("PAIMANA PREDICT: TEMPORAL BACKTESTING VERIFICATION SUITE")
    print("=" * 75)

    backtest_path = os.path.join("ml", "artifacts", "backtesting_results.json")
    assert os.path.exists(backtest_path), "backtesting_results.json not found"

    with open(backtest_path, "r", encoding="utf-8") as f:
        bt = json.load(f)

    avg_lead = bt.get("average_lead_time_months", 0)
    det_rate = bt.get("detection_rate_pct", 0)
    fwr = bt.get("false_warning_rate_pct", 100)

    assert avg_lead >= 3.0, f"Average lead time too low: {avg_lead} months"
    assert det_rate >= 80.0, f"Detection rate too low: {det_rate}%"
    assert fwr <= 15.0, f"False warning rate too high: {fwr}%"

    print(f"TEST 1: Backtesting Results Validated (Avg Lead Time: {avg_lead} Mo, Detection: {det_rate}%, False Warning: {fwr}%) -> PASS")

    # Start test server to test /api/v1/backtests/:modelId
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
        status, api_res = make_request("/api/v1/backtests/time-gbm-v1.4/backtest")
        assert status == 200, f"Backtest endpoint failed: {api_res}"
        data = api_res.get("data", {})
        assert data.get("averageLeadTimeMonths") >= 3.0, "API returned invalid lead time"
        assert "leadTimeDistribution" in data, "leadTimeDistribution missing from API response"
        print(f"TEST 2: /api/v1/backtests/:modelId API Endpoint Verified -> PASS")
    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=3)
        except Exception:
            server_proc.kill()

    print("=" * 75)
    print("ALL TEMPORAL BACKTESTING TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
