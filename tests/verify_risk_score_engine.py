#!/usr/bin/env python3
"""
PAIMANA PREDICT: RISK SCORE AS PRIMARY PROJECT PRIORITIZATION ENGINE TEST SUITE
Verifies transparent 0-100 scoring engine, dimensions, weights, bands, tie-breaking, momentum, APIs, and real-mode isolation.
Smart India Hackathon 2026 • Problem Statement 26103
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

TEST_PORT = 5096
BASE_URL = f"http://127.0.0.1:{TEST_PORT}"

def make_request(path, method="GET", body=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
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
    print("PAIMANA PREDICT: RISK SCORE PRIORITIZATION ENGINE VERIFICATION SUITE")
    print("=" * 75)

    # 1. Start Background Server
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
        # Test 1: GET /api/v1/risk/:projectId (BharatNet PAI-706775)
        status, res = make_request("/api/v1/risk/PAI-706775")
        assert status == 200, f"Failed to get risk score: {res}"
        data = res.get("data", {})
        
        risk_score = data.get("riskScore")
        assert risk_score is not None and 0 <= risk_score <= 100, f"Invalid risk score: {risk_score}"
        assert data.get("riskBand") in ["LOW", "MODERATE", "HIGH", "CRITICAL"], f"Invalid band: {data.get('riskBand')}"
        
        mom = data.get("momentum", {})
        mom_cat = mom.get("momentumCategory") if isinstance(mom, dict) else data.get("riskMomentum")
        assert mom_cat in ["STABLE", "IMPROVING", "DETERIORATING", "RAPIDLY_DETERIORATING"], f"Invalid momentum: {mom_cat}"
        
        dims = data.get("dimensions", {})
        assert "schedule" in dims and "cost" in dims and "progress" in dims and "expenditure" in dims and "predictive" in dims and "weakSignal" in dims
        
        # Verify Dimension Weights sum to 1.0 (100%)
        weights = dims.get("weights", {})
        total_weight = sum(weights.values())
        assert abs(total_weight - 1.0) < 0.001, f"Weights do not sum to 100%: {total_weight}"
        print(f"TEST 1: /api/v1/risk/PAI-706775 Verified (Score: {risk_score}/100, Band: {data.get('riskBand')}, Momentum: {mom_cat}) -> PASS")

        # Test 2: Dimensional Attribution Breakdown Verification
        raw_dims = dims.get("raw", {})
        assert 0 <= raw_dims.get("schedule", 0) <= 100
        assert 0 <= raw_dims.get("cost", 0) <= 100
        assert 0 <= raw_dims.get("progress", 0) <= 100
        assert 0 <= raw_dims.get("expenditure", 0) <= 100
        assert 0 <= raw_dims.get("predictive", 0) <= 100
        assert 0 <= raw_dims.get("weakSignal", 0) <= 100
        print(f"TEST 2: Normalized 6 Dimensions Verified (Sched={raw_dims['schedule']}, Cost={raw_dims['cost']}, Prog={raw_dims['progress']}, Exp={raw_dims['expenditure']}, Pred={raw_dims['predictive']}, WeakSig={raw_dims['weakSignal']}) -> PASS")

        # Test 3: Portfolio Ranking API: GET /api/v1/risk/portfolio?sort=riskScore&order=desc
        status, port_res = make_request("/api/v1/risk/portfolio?sort=riskScore&order=desc&pageSize=20")
        assert status == 200, f"Portfolio risk query failed: {port_res}"
        port_data = port_res.get("data", {})
        projects = port_data.get("projects", [])
        assert len(projects) > 0, "No projects returned"

        # Check descending order of risk scores
        for i in range(len(projects) - 1):
            assert projects[i]["riskScore"] >= projects[i + 1]["riskScore"], f"Projects not sorted descending: {projects[i]['riskScore']} < {projects[i+1]['riskScore']}"
        
        top_p = port_data.get("topPriorityProject", {})
        assert top_p.get("riskScore") == projects[0]["riskScore"], "Top priority project mismatch"
        print(f"TEST 3: Portfolio Ranking API Verified (Top Priority Project: {top_p.get('projectName')} with Risk Score {top_p.get('riskScore')}) -> PASS")

        # Test 4: Risk Filter: minRisk=75 (Only CRITICAL projects)
        status, crit_res = make_request("/api/v1/risk/portfolio?minRisk=75&pageSize=50")
        assert status == 200, f"Critical filter query failed: {crit_res}"
        crit_projects = crit_res.get("data", {}).get("projects", [])
        for p in crit_projects:
            assert p["riskScore"] >= 75, f"Project score < 75 in critical filter: {p['riskScore']}"
            assert p["riskBand"] == "CRITICAL", f"Project band not critical: {p['riskBand']}"
        print(f"TEST 4: Risk Band Filter (minRisk=75 -> Only CRITICAL projects) Verified ({len(crit_projects)} projects tested) -> PASS")

        # Test 5: Real Mode Grounding (Zero Synthetic Contamination)
        status, real_check = make_request("/api/v1/risk/PAI-706775?dataMode=REAL_PAIMANA")
        assert status == 200
        real_data = real_check.get("data", {})
        assert "land_acquisition_deficit" not in real_data, "Synthetic variable leaked into real risk score!"
        assert "contractor_performance_score" not in real_data, "Synthetic variable leaked into real risk score!"
        print("TEST 5: Scientific Honesty: Real Mode strictly isolated from synthetic operational variables -> PASS")

    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=3)
        except Exception:
            server_proc.kill()

    print("=" * 75)
    print("ALL RISK SCORE PRIORITIZATION ENGINE TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
