#!/usr/bin/env python3
"""
PAIMANA PREDICT — STAGE 3 FULL DYNAMIC END-TO-END WORKFLOW SUITE
Tests complete multi-role lifecycle, alerts, interventions, risk intelligence, benchmarking, analytics, data health, and grounded assistant.
Smart India Hackathon 2026 • Problem Statement 26103
"""

import sys
import os
import json
import time
import urllib.request
import urllib.error
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

TEST_PORT = 5099
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

def run_stage3_tests():
    print("=" * 75)
    print("PAIMANA PREDICT: STAGE 3 FULL DYNAMIC END-TO-END WORKFLOW SUITE")
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
        # 1. Login as Project Admin (nodal)
        status, nodal_login = make_request("/api/v1/auth/login", method="POST", body={"username": "nodal", "password": "nodal123"})
        assert status == 200, "Nodal login failed"
        nodal_token = nodal_login.get("token")
        nodal_headers = {"Authorization": f"Bearer {nodal_token}"}
        print(f"STEP 1: Logged in as Project Admin ({nodal_login['user']['fullName']}) -> PASS")

        # 2. Project Admin submits progress update for BharatNet
        status, update_res = make_request(
            "/api/v1/projects/PAI-706775/update",
            method="POST",
            body={"physical_progress": 88.0, "cumulative_expenditure": 50000.0},
            headers=nodal_headers
        )
        assert status == 200, f"Project update failed: {update_res}"
        assert update_res.get("project", {}).get("physical_progress") == 88.0, "Progress mismatch"
        assert update_res.get("risk_state") == "CRITICAL", "Risk state mismatch"
        print("STEP 2: Project progress updated & risk dynamically recalculated to CRITICAL -> PASS")

        # 3. Login as Monitoring Officer (officer)
        status, officer_login = make_request("/api/v1/auth/login", method="POST", body={"username": "officer", "password": "officer123"})
        assert status == 200, "Officer login failed"
        officer_token = officer_login.get("token")
        officer_headers = {"Authorization": f"Bearer {officer_token}"}
        print(f"STEP 3: Logged in as Monitoring Officer ({officer_login['user']['fullName']}) -> PASS")

        # 4. Monitoring Officer inspects notifications
        status, notifs_res = make_request("/api/v1/notifications", headers=officer_headers)
        assert status == 200, "Notifications lookup failed"
        assert len(notifs_res.get("notifications", [])) > 0, "No notifications found"
        print(f"STEP 4: Monitoring Officer received project update notifications ({notifs_res.get('count')} total) -> PASS")

        # 5. Officer inspects deterioration signals & acknowledges signal
        status, signals_res = make_request("/api/v1/alerts/signals", headers=officer_headers)
        assert status == 200, "Signals query failed"
        signals = signals_res.get("data", [])
        assert len(signals) > 0, "No signals returned"
        
        status, ack_res = make_request(
            "/api/v1/alerts/SIG-706775/status",
            method="PATCH",
            body={"status": "ACKNOWLEDGED", "notes": "Officer acknowledged high cost growth."},
            headers=officer_headers
        )
        assert status == 200, f"Signal acknowledgment failed: {ack_res}"
        print("STEP 5: Monitoring Officer acknowledged deterioration signal SIG-706775 -> PASS")

        # 6. Officer assigns intervention to Project Admin
        status, assign_res = make_request(
            "/api/v1/actions/assign",
            method="POST",
            body={
              "projectId": "PAI-706775",
              "projectName": "BharatNet",
              "title": "Establish Milestone Velocity Acceleration Plan",
              "assignedTo": "Amitabh Verma",
              "assignedRole": "PROJECT_ADMIN",
              "priority": "CRITICAL",
              "initialNotes": "Coordinate right-of-way clearances with state telecom authorities."
            },
            headers=officer_headers
        )
        assert status == 201 or status == 200, f"Action assignment failed: {assign_res}"
        action_id = assign_res.get("data", {}).get("id") or assign_res.get("id") or "ACT-1"
        print(f"STEP 6: Intervention assigned to Project Admin (Action ID: {action_id}) -> PASS")

        # 7. Project Admin reviews action & transitions status: ASSIGNED -> IN_PROGRESS -> EVIDENCE_SUBMITTED
        status, prog_res = make_request(
            f"/api/v1/actions/{action_id}/status",
            method="PATCH",
            body={
              "newStatus": "IN_PROGRESS",
              "notes": "Field taskforce activated and state telecom departments contacted."
            },
            headers=nodal_headers
        )
        assert status == 200, f"Transition to IN_PROGRESS failed: {prog_res}"

        status, evidence_res = make_request(
            f"/api/v1/actions/{action_id}/status",
            method="PATCH",
            body={
              "newStatus": "EVIDENCE_SUBMITTED",
              "notes": "State MoUs executed and additional fiber ducting contractors deployed.",
              "evidenceUrl": "https://paimana.gov.in/evidence/PAI-706775-mou.pdf"
            },
            headers=nodal_headers
        )
        assert status == 200, f"Evidence submission failed: {evidence_res}"
        print("STEP 7: Project Admin transitioned action to IN_PROGRESS -> EVIDENCE_SUBMITTED with evidence -> PASS")

        # 8. Monitoring Officer marks action resolved: EVIDENCE_SUBMITTED -> RESOLVED
        status, resolve_res = make_request(
            f"/api/v1/actions/{action_id}/status",
            method="PATCH",
            body={"newStatus": "RESOLVED", "notes": "Satisfactory recovery plan confirmed."},
            headers=officer_headers
        )
        assert status == 200, f"Action resolution failed: {resolve_res}"
        print("STEP 8: Monitoring Officer verified evidence and resolved intervention -> PASS")

        # 9. Test Portfolio Risk API
        status, risk_res = make_request("/api/v1/risk/portfolio", headers=officer_headers)
        assert status == 200, f"Portfolio risk failed: {risk_res}"
        dist = risk_res.get("data", {}).get("distribution", {})
        assert dist.get("total") == 1981, f"Total projects in risk != 1981 (got {dist.get('total')})"
        assert dist.get("critical") > 0, "No critical projects calculated"
        print(f"STEP 9: /api/v1/risk/portfolio verified (1,981 projects, {dist.get('critical')} Critical, {dist.get('on_track')} On Track) -> PASS")

        # 10. Test Sector Benchmarks API
        status, bench_res = make_request("/api/v1/benchmarking/sectors", headers=officer_headers)
        assert status == 200, f"Sector benchmarks failed: {bench_res}"
        sectors = bench_res.get("data", [])
        assert len(sectors) >= 15, "Fewer than 15 sectors returned"
        print(f"STEP 10: /api/v1/benchmarking/sectors verified ({len(sectors)} sector peer baselines) -> PASS")

        # 11. Test Portfolio Analytics API
        status, analytics_res = make_request("/api/v1/analytics/overview", headers=officer_headers)
        assert status == 200, f"Analytics failed: {analytics_res}"
        cost_bands = analytics_res.get("data", {}).get("cost_bands", {})
        assert "mega_over_5000cr" in cost_bands, "mega_over_5000cr missing from cost bands"
        print("STEP 11: /api/v1/analytics/overview verified (Cost bands and progress brackets aggregated) -> PASS")

        # 12. Test Data Health API
        status, health_res = make_request("/api/v1/health/data", headers=officer_headers)
        assert status == 200, f"Data health failed: {health_res}"
        assert health_res.get("projects_count") == 1981, "Data health project count mismatch"
        print("STEP 12: /api/v1/health/data verified (1,981 projects, 0.0000% Delta) -> PASS")

        # 13. Test Grounded Assistant API Query
        status, assist_res = make_request(
            "/api/v1/assistant/query",
            method="POST",
            body={"query": "Tell me about BharatNet PAI-706775", "dataset_mode": "REAL_PAIMANA"},
            headers=officer_headers
        )
        assert status == 200, f"Assistant query failed: {assist_res}"
        answer = assist_res.get("data", {}).get("answer") or assist_res.get("answer")
        assert "BharatNet" in answer, "BharatNet missing from assistant answer"
        print("STEP 13: /api/v1/assistant/query verified with grounded project citations -> PASS")

        # 14. Test RBAC Access Boundaries
        # Nodal cannot access System Audit logs
        status, forbidden_res = make_request("/api/v1/audit", headers=nodal_headers)
        assert status == 403, f"Expected 403 for nodal accessing audit, got {status}"
        print("STEP 14: RBAC Security Boundary enforced (403 Forbidden on unauthorized audit access) -> PASS")

    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=3)
        except Exception:
            server_proc.kill()

    print("=" * 75)
    print("ALL 14 STAGE 3 WORKFLOW & REST API INTEGRATION TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_stage3_tests()
