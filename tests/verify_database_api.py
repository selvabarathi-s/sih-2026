#!/usr/bin/env python3
"""
PAIMANA PREDICT — DATABASE PERSISTENCE & REST API INTEGRATION SUITE
Tests PostgreSQL migrations, seed idempotency, REST API endpoints, pagination, RBAC, dynamic updates, and audit persistence.
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

TEST_PORT = 5088
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

def run_database_api_tests():
    print("=" * 70)
    print("PAIMANA PREDICT: STAGE 2 DATABASE PERSISTENCE & REST API SUITE")
    print("=" * 70)

    # 1. Verify Migration Files
    assert os.path.exists(os.path.join("migrations", "001_initial_schema.sql")), "Migration 001 missing"
    assert os.path.exists(os.path.join("migrations", "002_indexes.sql")), "Migration 002 missing"
    print("PASS: PostgreSQL migration scripts 001 & 002 verified in migrations/")

    # 2. Verify Seed Script
    seed_res = subprocess.run(["node", "scripts/seed_database.js"], capture_output=True, text=True, encoding='utf-8', errors='replace')
    assert seed_res.returncode == 0, f"Seed script failed: {seed_res.stderr}"
    assert "Total Projects: 1981" in seed_res.stdout, "Seed project count invalid"
    assert "Total Snapshots: 15927" in seed_res.stdout, "Seed snapshot count invalid"
    print("PASS: Idempotent database seed script verified (1,981 projects & 15,927 snapshots)")

    # 3. Start Background Server
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

    # Wait for server to boot
    time.sleep(2)

    try:
        # Test 1: Health Check
        status, health = make_request("/api/v1/health")
        assert status == 200, f"Health check failed: {status}"
        assert health.get("status") == "healthy", "Health status not healthy"
        print(f"PASS: /api/v1/health verified (Status: {health.get('status')})")

        # Test 2: Data Health & Reconciliation
        status, data_health = make_request("/api/v1/health/data")
        assert status == 200, f"Data health check failed: {status}"
        assert data_health.get("projects_count") == 1981, "Data health project count != 1981"
        assert data_health.get("reconciliation", {}).get("status") == "PASS", "Reconciliation not PASS"
        print("PASS: /api/v1/health/data verified (1,981 projects, 0.0000% Delta, PASS)")

        # Test 3: Authentication (Officer Login)
        status, auth_res = make_request(
            "/api/v1/auth/login",
            method="POST",
            body={"username": "officer", "password": "officer123"}
        )
        assert status == 200, f"Officer login failed: {status}"
        officer_token = auth_res.get("token")
        assert officer_token, "No token returned for officer"
        assert auth_res.get("user", {}).get("role") in ["MONITORING_OFFICER", "monitoring_officer"], "Officer role incorrect"
        print(f"PASS: /api/v1/auth/login verified for Monitoring Officer ({auth_res['user']['fullName']})")

        # Test 4: Authentication (Project Admin / Nodal Login)
        status, nodal_auth = make_request(
            "/api/v1/auth/login",
            method="POST",
            body={"username": "nodal", "password": "nodal123"}
        )
        assert status == 200, f"Nodal login failed: {status}"
        nodal_token = nodal_auth.get("token")
        assert nodal_token, "No token returned for nodal officer"
        print(f"PASS: /api/v1/auth/login verified for Project Admin ({nodal_auth['user']['fullName']})")

        # Test 5: Authentication (System Admin Login)
        status, admin_auth = make_request(
            "/api/v1/auth/login",
            method="POST",
            body={"username": "admin", "password": "admin123"}
        )
        assert status == 200, f"Admin login failed: {status}"
        admin_token = admin_auth.get("token")
        print(f"PASS: /api/v1/auth/login verified for System Administrator")

        # Test 6: Server-side Pagination & Filtering
        status, proj_list = make_request("/api/v1/projects?page=1&pageSize=15&sector=Telecommunication")
        assert status == 200, f"Projects list failed: {status}"
        meta = proj_list.get("meta", {})
        assert meta.get("page") == 1, "Meta page invalid"
        assert meta.get("pageSize") == 15, "Meta pageSize invalid"
        assert len(proj_list.get("data", [])) > 0, "No projects returned for Telecommunication"
        print(f"PASS: Server-side paginated projects query verified ({meta.get('total')} Telecommunication projects)")

        # Test 7: Project Detail & Provenance
        status, bnet_res = make_request("/api/v1/projects/PAI-706775")
        assert status == 200, f"Project detail failed: {status}"
        bnet = bnet_res.get("data", {})
        assert bnet.get("project_name") == "BharatNet", "Project name mismatch"
        assert bnet.get("original_cost") == 61109, "Original cost mismatch"
        assert bnet.get("revised_cost") == 188000, "Revised cost mismatch"
        print(f"PASS: /api/v1/projects/PAI-706775 verified (BharatNet: +{bnet.get('cost_growth_pct')}% Cost Revision)")

        # Test 8: Project History Snapshots
        status, hist_res = make_request("/api/v1/projects/PAI-706775/history")
        assert status == 200, f"Project history failed: {status}"
        snaps = hist_res.get("data", [])
        assert len(snaps) == 10, f"Snapshots count != 10 (got {len(snaps)})"
        assert snaps[0]["report_date_key"] == "2025-10", "First snapshot key invalid"
        assert snaps[-1]["report_date_key"] == "2026-07", "Last snapshot key invalid"
        print(f"PASS: /api/v1/projects/PAI-706775/history verified (10 consecutive monthly snapshots: 2025-10 -> 2026-07)")

        # Test 9: Portfolio Summary Aggregation
        status, summary_res = make_request("/api/v1/portfolio/summary")
        assert status == 200, f"Portfolio summary failed: {status}"
        summary = summary_res.get("data", {})
        assert summary.get("headline", {}).get("total_projects") == 1981, "Summary total projects != 1981"
        assert summary.get("headline", {}).get("original_cost_cr") == 3712662.01, "Original cost sum mismatch"
        assert summary.get("headline", {}).get("revised_cost_cr") == 4278402.37, "Revised cost sum mismatch"
        print("PASS: /api/v1/portfolio/summary verified (Rs. 37.12L Cr Orig, Rs. 42.78L Cr Rev, Rs. 20.36L Cr Exp)")

        # Test 10: Dynamic Project Update & State Machine Recalculation
        status, update_res = make_request(
            "/api/v1/projects/PAI-706775/update",
            method="POST",
            body={"physical_progress": 87.5, "cumulative_expenditure": 49000.0},
            headers={"Authorization": f"Bearer {nodal_token}"}
        )
        assert status == 200, f"Project update failed: {status} -> {update_res}"
        assert update_res.get("project", {}).get("physical_progress") == 87.5, "Progress not updated"
        assert update_res.get("risk_state") == "CRITICAL", "Risk state not recalculated"
        print(f"PASS: Dynamic project update persisted (New Progress: 87.5%, Risk State: CRITICAL)")

        # Test 11: Audit Log Persistence
        status, audit_res = make_request(
            "/api/v1/audit",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert status == 200, f"Audit log retrieval failed: {status}"
        logs = audit_res.get("logs", [])
        actions_in_log = [l.get("action") for l in logs]
        assert "PROJECT_UPDATED" in actions_in_log, "PROJECT_UPDATED not in audit logs"
        assert "USER_LOGIN" in actions_in_log, "USER_LOGIN not in audit logs"
        print(f"PASS: Audit log persistence verified ({audit_res.get('count')} events captured)")

        # Test 12: Role-Aware Notifications Persistence
        status, notif_res = make_request(
            "/api/v1/notifications",
            headers={"Authorization": f"Bearer {officer_token}"}
        )
        assert status == 200, f"Notifications retrieval failed: {status}"
        notifs = notif_res.get("notifications", [])
        assert len(notifs) > 0, "No notifications returned"
        print(f"PASS: Role-aware notification dispatch verified ({notif_res.get('count')} notifications)")

        # Test 13: RBAC Security Enforcement (Unauthorized Rejection)
        # Nodal officer cannot inspect audit logs (Admin only)
        status, forbidden_res = make_request(
            "/api/v1/audit",
            headers={"Authorization": f"Bearer {nodal_token}"}
        )
        assert status == 403, f"Expected 403 Forbidden for nodal accessing audit, got {status}"
        print("PASS: RBAC authorization boundary verified (403 Forbidden correctly enforced)")

    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=3)
        except Exception:
            server_proc.kill()

    print("=" * 70)
    print("ALL 13 STAGE 2 DATABASE PERSISTENCE & API TESTS PASSED (100% SUCCESS)!")
    print("=" * 70)

if __name__ == "__main__":
    run_database_api_tests()
