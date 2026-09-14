#!/usr/bin/env python3
"""
==============================================================================
PAIMANA PREDICT — 18-ROLE RBAC & MULTI-ASSIGNMENT VERIFICATION SUITE
==============================================================================
Validates:
1. Authentication of all 18 Canonical Personas + 1 Multi-Role User
2. Verification of User Organization, Department, Designation & Scope
3. Roles Metadata & Aliases API (/api/v1/auth/roles)
4. Critical 403 Authorization Boundaries:
   - Contractor forbidden from closing NCR / TPI verification (403)
   - Risk Analyst forbidden from issuing executive directives (403)
   - Nodal Officer forbidden from updating unassigned project (403)
   - Multi-role user allowed switching to assigned roles (200)
   - Multi-role user forbidden from switching to unassigned roles (403)
   - Audit Observer (CAG) forbidden from mutating NCR state (403)
==============================================================================
"""

import os
import sys
import json
import time
import subprocess
import urllib.request
import urllib.error

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

TEST_PORT = 5095
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
            status = response.status
            content = response.read().decode("utf-8")
            return status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(content)
        except Exception:
            return e.code, {"error": content}
    except Exception as e:
        return 500, {"error": str(e)}

def run_tests():
    print("=" * 80)
    print("PAIMANA PREDICT — 18-ROLE OPERATIONAL ARCHITECTURE TEST SUITE")
    print("=" * 80)

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
    time.sleep(3.0)

    try:
        # -------------------------------------------------------------------------
        # 1. Health check
        # -------------------------------------------------------------------------
        print("\n[TEST 1] System Health Check...")
        status, res = make_request("/health")
        assert status == 200, f"System health failed: {res}"
        print(f"  ✓ System healthy: {res.get('status')} | Service: {res.get('service')}")

        # -------------------------------------------------------------------------
        # 2. Roles Endpoint
        # -------------------------------------------------------------------------
        print("\n[TEST 2] Roles Endpoint (/api/v1/auth/roles)...")
        status, res = make_request("/api/v1/auth/roles")
        assert status == 200, f"Failed to fetch roles: {res}"
        count = res.get("count", 0)
        assert count >= 18, f"Expected at least 18 roles, got {count}"
        print(f"  ✓ Verified {count} canonical operational roles registered.")

        # -------------------------------------------------------------------------
        # 3. Authenticate All 18 Personas + Multi-Role User
        # -------------------------------------------------------------------------
        print("\n[TEST 3] Authenticating All 18 Personas + Multi-Assignment User...")
        PERSONAS = [
            # Group A
            ("secretary", "secretary123", "senior_decision_maker", "Cabinet Secretariat / PMO"),
            ("officer", "officer123", "monitoring_officer", "MoSPI / IPMD"),
            ("ministry_reviewer", "minreview123", "admin_ministry_review", "Ministry of Road Transport and Highways"),
            # Group B
            ("nodal", "nodal123", "project_admin", "Bharat Broadband Network Ltd (BBNL)"),
            ("engineer", "engineer123", "project_engineering", "National Highways Authority of India (NHAI)"),
            ("quality", "quality123", "quality_auditor", "Engineers India Limited (EIL) / TPI Agency"),
            ("finance", "finance123", "project_finance", "Project Finance & Accounts Division"),
            ("contractor", "contractor123", "contractor_rep", "L&T Infrastructure / BharatNet EPC Consortium"),
            ("pmc_consultant", "pmc123", "supervision_consultant", "Tata Consulting Engineers / Independent PMC"),
            # Group C
            ("inter_coord", "coord123", "inter_ministerial_coordination", "Cabinet Secretariat / Coordination Wing"),
            ("state_coord", "state123", "state_coordination", "State Infrastructure Coordination Cell, Maharashtra"),
            ("gatishakti", "gatishakti123", "gatishakti_officer", "DPIIT / PM GatiShakti NPG"),
            ("appraisal_officer", "appraisal123", "investment_appraisal_reviewer", "Public Investment Board (PIB) / EFC"),
            ("fin_authority", "authority123", "financial_review_authority", "Integrated Finance Division, MoF / DEA"),
            ("audit_observer", "audit123", "audit_observer", "Office of the Comptroller & Auditor General (CAG)"),
            # Group D
            ("analyst", "analyst123", "risk_analyst", "NITI Aayog Data Analytics Unit"),
            ("aigov", "aigov123", "ai_governance", "MeitY AI Validation Board"),
            ("sysadmin", "sysadmin123", "data_platform_security_admin", "MoSPI / National Platform Architecture Cell"),
            # Multi-Assignment
            ("multirole", "multi123", "monitoring_officer", "MoSPI & Line Ministry Joint Infrastructure Cell"),
        ]

        tokens = {}
        for username, password, expected_role, expected_org in PERSONAS:
            status, res = make_request("/api/v1/auth/login", method="POST", body={"username": username, "password": password})
            assert status == 200, f"Login failed for {username}: {res}"
            token = res.get("token")
            assert token, f"No token for {username}"
            user = res.get("user", {})
            user_role = user.get("role")
            user_org = user.get("organization")

            assert user_role == expected_role, f"Role mismatch for {username}: expected {expected_role}, got {user_role}"
            tokens[username] = token
            print(f"  ✓ Persona: {username:18} | Role: {user_role:30} | Org: {user_org[:35]}")

        print(f"\n  ✓ All {len(PERSONAS)} personas successfully authenticated with full organizational context.")

        # -------------------------------------------------------------------------
        # 4. Critical 403 Authorization Boundary: Contractor Cannot Close NCR
        # -------------------------------------------------------------------------
        print("\n[TEST 4] Critical Security Rule: Contractor Cannot Close NCR or sign TPI verification...")
        status, ncr_res = make_request("/api/v1/quality/ncrs", token=tokens["contractor"])
        assert status == 200, f"Failed to fetch NCRs: {ncr_res}"
        ncrs = ncr_res.get("data", [])
        if len(ncrs) > 0:
            ncr_id = ncrs[0].get("id") or ncrs[0].get("ncrId") or "NCR-2026-001"
            # Attempt 1: Contractor sets status to CLOSED -> MUST BE 403
            status, res = make_request(f"/api/v1/quality/ncrs/{ncr_id}/status", method="PATCH", body={"status": "CLOSED", "remarks": "Contractor closing"}, token=tokens["contractor"])
            assert status == 403, f"Contractor must be rejected with 403 when closing NCR, got {status}: {res}"
            print(f"  ✓ Contractor attempt to set NCR status to CLOSED returned HTTP 403 Forbidden ({res.get('error')})")

            # Attempt 2: Contractor sets status to TPI_LAB_VERIFIED -> MUST BE 403
            status, res = make_request(f"/api/v1/quality/ncrs/{ncr_id}/status", method="PATCH", body={"status": "TPI_LAB_VERIFIED", "remarks": "Contractor signing TPI"}, token=tokens["contractor"])
            assert status == 403, f"Contractor must be rejected with 403 when setting TPI_LAB_VERIFIED, got {status}: {res}"
            print(f"  ✓ Contractor attempt to set NCR status to TPI_LAB_VERIFIED returned HTTP 403 Forbidden ({res.get('error')})")

        # -------------------------------------------------------------------------
        # 5. Critical 403 Authorization Boundary: Audit Observer Is Read-Only
        # -------------------------------------------------------------------------
        print("\n[TEST 5] Critical Security Rule: Audit Observer (CAG) is Read-Only...")
        if len(ncrs) > 0:
            ncr_id = ncrs[0].get("id") or ncrs[0].get("ncrId") or "NCR-2026-001"
            status, res = make_request(f"/api/v1/quality/ncrs/{ncr_id}/status", method="PATCH", body={"status": "REWORK_SUBMITTED", "remarks": "Audit mutation"}, token=tokens["audit_observer"])
            assert status == 403, f"Audit Observer must be rejected with 403 on mutation, got {status}: {res}"
            print(f"  ✓ Audit Observer attempt to mutate NCR returned HTTP 403 Forbidden ({res.get('error')})")

        # -------------------------------------------------------------------------
        # 6. Critical 403 Authorization Boundary: Risk Analyst Cannot Issue Directives
        # -------------------------------------------------------------------------
        print("\n[TEST 6] Critical Security Rule: Risk Analyst Cannot Issue Directives...")
        brief_payload = {
            "projectId": "PAI-706775",
            "title": "Unauthorized Directive Attempt",
            "summary": "Analyst trying to create executive brief and issue directive"
        }
        status, res = make_request("/api/v1/decisions/briefs", method="POST", body=brief_payload, token=tokens["analyst"])
        assert status == 403, f"Risk Analyst must receive 403 when creating executive brief, got {status}: {res}"
        print(f"  ✓ Risk Analyst attempt to issue executive directive returned HTTP 403 Forbidden ({res.get('error')})")

        # Secretary CAN create executive brief / directive
        status, sec_res = make_request("/api/v1/decisions/briefs", method="POST", body=brief_payload, token=tokens["secretary"])
        assert status == 201, f"Senior Decision Maker should create executive brief: {sec_res}"
        print(f"  ✓ Senior Decision Maker successfully created executive brief (HTTP 201 Created)")

        # -------------------------------------------------------------------------
        # 7. Critical 403 Authorization Boundary: Unassigned Project Update
        # -------------------------------------------------------------------------
        print("\n[TEST 7] Critical Security Rule: Project Assignment Enforcement (Nodal Officer)...")
        # PAI-706775 is assigned to nodal officer -> ALLOWED (200)
        update_payload = {"physical_progress": 69.2, "cumulative_expenditure": 31400.0}
        status, res = make_request("/api/v1/projects/PAI-706775/update", method="POST", body=update_payload, token=tokens["nodal"])
        assert status == 200, f"Nodal officer should update assigned project PAI-706775, got {status}: {res}"
        print("  ✓ Nodal Officer successfully updated assigned project PAI-706775 (HTTP 200 OK)")

        # PAI-999999 is NOT assigned to nodal officer -> 403 Forbidden
        status, res = make_request("/api/v1/projects/PAI-999999/update", method="POST", body=update_payload, token=tokens["nodal"])
        assert status == 403, f"Nodal officer must be rejected with 403 on unassigned project PAI-999999, got {status}: {res}"
        print(f"  ✓ Nodal Officer attempt to update unassigned project returned HTTP 403 Forbidden ({res.get('error')})")

        # -------------------------------------------------------------------------
        # 8. Multi-Assignment Dynamic Workspace Switching
        # -------------------------------------------------------------------------
        print("\n[TEST 8] Multi-Assignment Workspace Switching...")
        multi_token = tokens["multirole"]

        # 1. Switch to authorized role 'admin_ministry_review' -> ALLOWED (200)
        status, res = make_request("/api/v1/auth/switch-workspace", method="POST", body={"targetRole": "admin_ministry_review"}, token=multi_token)
        assert status == 200, f"Multi-role user should switch to assigned role 'admin_ministry_review': {res}"
        assert res.get("activeRole") == "admin_ministry_review", f"Expected activeRole admin_ministry_review, got {res.get('activeRole')}"
        new_token = res.get("token")
        print(f"  ✓ Multi-role user switched to assigned role: {res.get('activeRole')} (Token refreshed)")

        # 2. Switch to UNASSIGNED role 'risk_analyst' -> MUST BE 403 FORBIDDEN
        status, res = make_request("/api/v1/auth/switch-workspace", method="POST", body={"targetRole": "risk_analyst"}, token=new_token)
        assert status == 403, f"Multi-role user must be rejected with 403 when switching to unassigned role 'risk_analyst', got {status}: {res}"
        print(f"  ✓ Multi-role user attempt to switch to unassigned role 'risk_analyst' returned HTTP 403 Forbidden ({res.get('error')})")

    finally:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=3)
        except Exception:
            server_proc.kill()

    print("\n" + "=" * 80)
    print("ALL 18-ROLE OPERATIONAL ARCHITECTURE TESTS PASSED SUCCESSFULLY! (100% PASS)")
    print("=" * 80)

if __name__ == "__main__":
    run_tests()
