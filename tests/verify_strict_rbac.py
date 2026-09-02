#!/usr/bin/env python3
"""
PAIMANA PREDICT: STRICT ROLE-BASED ACCESS CONTROL (RBAC) VERIFICATION SUITE
Verifies authentication, role boundaries, resource-level ownership, permission middleware, and audit trail.
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

TEST_PORT = 5094
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
    print("PAIMANA PREDICT: STRICT RBAC & RESOURCE AUTHORIZATION VERIFICATION SUITE")
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
        # Step 1: Test Login for all 5 roles
        roles_to_test = [
            ("officer", "officer123", "monitoring_officer"),
            ("nodal", "nodal123", "project_admin"),
            ("sysadmin", "sysadmin123", "system_admin"),
            ("analyst", "analyst123", "risk_analyst"),
            ("secretary", "secretary123", "senior_decision_maker"),
        ]

        tokens = {}
        for username, password, expected_role in roles_to_test:
            status, res = make_request("/api/v1/auth/login", method="POST", body={"username": username, "password": password})
            assert status == 200, f"Login failed for {username}: {res}"
            token = res.get("token")
            assert token, f"No token returned for {username}"
            user = res.get("user", {})
            user_role = user.get("role", "").lower()
            assert user_role == expected_role, f"Role mismatch for {username}: got {user_role}, expected {expected_role}"
            tokens[expected_role] = token
            print(f"STEP 1: Authenticated {username} -> Role: {expected_role} ({user.get('fullName')}) -> PASS")

        # Step 2: Test System Admin Restricted Routes (Audit & User Management)
        # SysAdmin -> ALLOWED
        status, audit_res = make_request("/api/v1/audit", token=tokens["system_admin"])
        assert status == 200, f"SysAdmin should access audit logs: {audit_res}"
        status, users_res = make_request("/api/v1/auth/users", token=tokens["system_admin"])
        assert status == 200, f"SysAdmin should access user management: {users_res}"
        print("STEP 2: System Administrator authorized for Audit Logs & User Management -> PASS")

        # Monitoring Officer -> DENIED (403 Forbidden)
        status, mo_audit = make_request("/api/v1/audit", token=tokens["monitoring_officer"])
        assert status == 403, f"Monitoring Officer must be forbidden from audit: got {status}"
        status, mo_users = make_request("/api/v1/auth/users", token=tokens["monitoring_officer"])
        assert status == 403, f"Monitoring Officer must be forbidden from user management: got {status}"
        print("STEP 3: Monitoring Officer forbidden from Audit Logs & User Management (403 Forbidden) -> PASS")

        # Project Admin -> DENIED (403 Forbidden)
        status, pa_audit = make_request("/api/v1/audit", token=tokens["project_admin"])
        assert status == 403, f"Project Admin must be forbidden from audit: got {status}"
        print("STEP 4: Project Administrator forbidden from Audit Logs (403 Forbidden) -> PASS")

        # Step 3: Test Intervention Assignment
        # Monitoring Officer -> ALLOWED (201 Created)
        assign_payload = {
            "projectId": "PAI-706775",
            "title": "Expedite Optical Fiber Cable (OFC) Stringing in Bihar Package 3",
            "priority": "CRITICAL",
            "assignedRole": "project_admin"
        }
        status, assign_res = make_request("/api/v1/actions/assign", method="POST", body=assign_payload, token=tokens["monitoring_officer"])
        assert status == 201, f"Monitoring officer should assign intervention: {assign_res}"
        print(f"STEP 5: Monitoring Officer authorized to assign intervention (Action ID: {assign_res.get('id')}) -> PASS")

        # Risk Analyst -> DENIED (403 Forbidden)
        status, ra_assign = make_request("/api/v1/actions/assign", method="POST", body=assign_payload, token=tokens["risk_analyst"])
        assert status == 403, f"Risk analyst must be forbidden from assigning interventions: got {status}"
        print("STEP 6: Risk Analyst forbidden from assigning interventions (403 Forbidden) -> PASS")

        # Step 4: Test Resource-Level Ownership (Project Admin updates assigned vs unassigned project)
        # Nodal Officer has PAI-706775 assigned -> ALLOWED (200 OK)
        update_payload = {"physical_progress": 88.5, "cumulative_expenditure": 21850.0}
        status, update_res = make_request("/api/v1/projects/PAI-706775/update", method="POST", body=update_payload, token=tokens["project_admin"])
        assert status == 200, f"Project Admin should update assigned project: {update_res}"
        print("STEP 7: Project Administrator authorized to update ASSIGNED project (PAI-706775) -> PASS")

        # Nodal Officer does NOT have PAI-619032 (Coal sector) assigned -> DENIED (403 Forbidden)
        status, unassigned_res = make_request("/api/v1/projects/PAI-619032/update", method="POST", body=update_payload, token=tokens["project_admin"])
        assert status == 403, f"Project Admin must be forbidden from updating UNASSIGNED project: got {status}"
        print(f"STEP 8: Resource-Level Check: Project Admin forbidden from UNASSIGNED project (PAI-619032 -> 403) -> PASS")

        # Decision Maker attempts to edit project data -> DENIED (403 Forbidden)
        status, dm_update = make_request("/api/v1/projects/PAI-706775/update", method="POST", body=update_payload, token=tokens["senior_decision_maker"])
        assert status == 403, f"Senior Decision Maker must be forbidden from editing project data: got {status}"
        print("STEP 9: Senior Decision Maker forbidden from editing project data (403 Forbidden) -> PASS")

        # Step 5: Test Unauthenticated / Invalid Token Rejection
        status, anon_res = make_request("/api/v1/audit")
        assert status == 401, f"Unauthenticated request must return 401: got {status}"
        status, bad_token_res = make_request("/api/v1/audit", token="invalid_tampered_token_xyz")
        assert status == 401, f"Invalid token request must return 401: got {status}"
        print("STEP 10: Unauthenticated and Invalid Token requests rejected (401 Unauthorized) -> PASS")

    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=3)
        except Exception:
            server_proc.kill()

    print("=" * 75)
    print("ALL STRICT RBAC & RESOURCE AUTHORIZATION TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
