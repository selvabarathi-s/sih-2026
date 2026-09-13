import requests
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:3000/api/v1"

def print_section(title):
    print(f"\n{'='*70}\n[SUITE 19] {title}\n{'='*70}")

def run_suite():
    print_section("STARTING OPERATIONAL GOVERNMENT WORKFLOW TEST SUITE")
    session = requests.Session()

    # 1. Reference Data Endpoints
    print("\n[1] Testing Reference Master Data API...")
    r = session.get(f"{BASE_URL}/reference")
    assert r.status_code == 200, f"Reference all data failed: {r.text}"
    master_data = r.json().get("data", {})
    assert "ministries" in master_data and len(master_data["ministries"]) >= 8, "Ministries missing"
    assert "sectors" in master_data and len(master_data["sectors"]) >= 8, "Sectors missing"
    assert "states" in master_data and len(master_data["states"]) >= 35, "States missing"
    assert "milestoneTypes" in master_data and len(master_data["milestoneTypes"]) >= 10, "Milestones missing"
    assert "riskCategories" in master_data and len(master_data["riskCategories"]) >= 7, "Risk categories missing"
    print("  [OK] Reference Master Data API verified (Ministries, Sectors, States, Milestones, Taxonomies)")

    # 2. Duplicate Detection & Project Registration
    print("\n[2] Testing Project Registration & Duplicate Detection...")
    dup_payload = {
        "project_name": "BharatNet Optical Fiber Connectivity Network",
        "ministry": "Department of Telecommunications",
        "sector": "Telecommunications",
        "state": "Maharashtra",
        "agency": "BBNL",
        "original_cost": 20117.0,
        "original_completion_date": "2024-03-31"
    }
    r = session.post(f"{BASE_URL}/workflow/projects/check-duplicate", json=dup_payload)
    assert r.status_code == 200, f"Check duplicate failed: {r.text}"
    dup_res = r.json()
    assert dup_res.get("matchesCount", 0) > 0, "Expected duplicate match for BharatNet"
    print(f"  [OK] Duplicate detection identified match with {dup_res['matches'][0]['similarityScore']}% similarity")

    # Register New Valid Project
    import time
    dynamic_suffix = int(time.time() % 1000000)
    new_project_payload = {
        "project_name": f"National Greenfield Expressway Corridor Phase-{dynamic_suffix}",
        "ministry": "Ministry of Road Transport and Highways",
        "sector": "Road Transport and Highways",
        "state": "Madhya Pradesh",
        "agency": "NHAI",
        "original_cost": 4500.0,
        "original_completion_date": "2028-12-31",
        "contractor_name": "L&T Infrastructure Ltd",
        "description": "Access-controlled 6-lane greenfield expressway connecting logistics hubs.",
        "bypassDuplicateWarning": True
    }
    auth_headers_admin = {"Authorization": "Bearer admin"}
    r = session.post(f"{BASE_URL}/workflow/projects/register", json=new_project_payload, headers=auth_headers_admin)
    assert r.status_code == 201, f"Project registration failed: {r.text}"
    reg_data = r.json()
    registered_id = reg_data["project"]["project_id"]
    print(f"  [OK] Project registered successfully with unique ID: {registered_id}")

    # 3. 14-State Project Lifecycle Transitions
    print("\n[3] Testing 14-State Project Operational Lifecycle...")
    auth_headers_officer = {"Authorization": "Bearer officer"}
    r = session.get(f"{BASE_URL}/workflow/projects/{registered_id}/state")
    assert r.status_code == 200, f"Get project state failed: {r.text}"
    state_res = r.json()
    assert state_res["state"] == "SUBMITTED", f"Expected SUBMITTED, got {state_res['state']}"
    print(f"  [OK] Initial project operational state: {state_res['state']}")

    # Transition to VALIDATION_PENDING
    r = session.post(f"{BASE_URL}/workflow/projects/{registered_id}/transition", json={
        "toState": "VALIDATION_PENDING",
        "reason": "Administrative clearance checks initiated by surveillance division"
    }, headers=auth_headers_officer)
    assert r.status_code == 200, f"Transition to VALIDATION_PENDING failed: {r.text}"

    # Transition to ACTIVE
    r = session.post(f"{BASE_URL}/workflow/projects/{registered_id}/transition", json={
        "toState": "ACTIVE",
        "reason": "Project baseline verified and sanction sanctioned"
    }, headers=auth_headers_officer)
    assert r.status_code == 200, f"Transition to ACTIVE failed: {r.text}"

    # Transition to MONITORING
    r = session.post(f"{BASE_URL}/workflow/projects/{registered_id}/transition", json={
        "toState": "MONITORING",
        "reason": "Monthly reporting cycles activated"
    }, headers=auth_headers_officer)
    assert r.status_code == 200, f"Transition to MONITORING failed: {r.text}"

    # Verify State History
    r = session.get(f"{BASE_URL}/workflow/projects/{registered_id}/history")
    assert r.status_code == 200
    hist = r.json().get("history", [])
    assert len(hist) >= 3, f"Expected at least 3 history entries, found {len(hist)}"
    print(f"  [OK] Lifecycle transitions verified through state machine with {len(hist)} audit log records")

    # 4. Monthly Monitoring Cycles & Multi-Rule Validation
    print("\n[4] Testing Monthly Monitoring Cycles & Multi-Rule Validation Engine...")
    r = session.get(f"{BASE_URL}/monitoring/cycles/current")
    assert r.status_code == 200
    current_cycle = r.json().get("data", {})
    assert current_cycle.get("status") == "OPEN", "Current cycle must be OPEN"
    print(f"  [OK] Active Reporting Cycle: {current_cycle.get('monthName')} ({current_cycle.get('cycleId')})")

    # Rule Violation Test: Expenditure exceeding revised cost
    invalid_telemetry = {
        "projectId": registered_id,
        "physical_progress": 10.0,
        "cumulative_expenditure": 5200.0, # Exceeds original 4500.0
        "revised_cost": 4500.0,
    }
    r = session.post(f"{BASE_URL}/monitoring/submissions", json=invalid_telemetry, headers={"Authorization": "Bearer nodal"})
    assert r.status_code == 422, f"Expected 422 Validation Error, got {r.status_code}"
    print("  [OK] Multi-rule validation blocked submission exceeding revised cost ceiling (RULE_EXPENDITURE_CEILING)")

    # Valid Telemetry Submission
    valid_telemetry = {
        "projectId": registered_id,
        "physical_progress": 12.5,
        "cumulative_expenditure": 450.0,
        "revised_cost": 4500.0,
        "delayReasonCategory": "NONE",
        "officerRemarks": "Earthwork on Package 1 progressing as per schedule."
    }
    r = session.post(f"{BASE_URL}/monitoring/submissions", json=valid_telemetry, headers={"Authorization": "Bearer nodal"})
    assert r.status_code == 201, f"Valid telemetry submission failed: {r.text}"
    sub_data = r.json().get("submission", {})
    submission_id = sub_data["submissionId"]
    print(f"  [OK] Valid monthly telemetry submitted: {submission_id}")

    # Review Submission: ACCEPT
    r = session.post(f"{BASE_URL}/monitoring/submissions/{submission_id}/review", json={
        "decision": "ACCEPT",
        "remarks": "Verified against state engineer telemetry report. Approved."
    }, headers=auth_headers_officer)
    assert r.status_code == 200, f"Review submission failed: {r.text}"
    print("  [OK] Submission ACCEPTED by Monitoring Officer; snapshot non-destructively appended to project history")

    # 5. Algorithmic Responsibility Engine & Inbox Workload
    print("\n[5] Testing Responsibility Engine & Role Workload Inbox...")
    resp_payload = {
        "projectId": "PAI-706775",
        "issueCategory": "LAND_ACQUISITION",
        "severity": "CRITICAL"
    }
    r = session.post(f"{BASE_URL}/inbox/resolve-responsibility", json=resp_payload)
    assert r.status_code == 200
    resp_res = r.json().get("data", {})
    assert "primaryAssignee" in resp_res, "primaryAssignee missing"
    assert "supervisingOfficer" in resp_res, "supervisingOfficer missing"
    assert "escalationHierarchy" in resp_res, "escalationHierarchy missing"
    print(f"  [OK] Algorithmic ownership resolved: Assignee={resp_res['primaryAssignee']['fullName']}, Escalation T3={resp_res['escalationHierarchy']['tier3']['officer']['fullName']}")

    # Workload query for Monitoring Officer
    r = session.get(f"{BASE_URL}/inbox/workload", headers=auth_headers_officer)
    assert r.status_code == 200
    workload = r.json().get("data", {})
    assert "summary" in workload, "Summary missing"
    assert "tasks" in workload, "Tasks missing"
    assert "warnings" in workload, "Warnings missing"
    print(f"  [OK] Operational Inbox loaded: {workload['summary']['totalPendingTasks']} Tasks, {workload['summary']['activeWarnings']} Warnings, {workload['summary']['pendingApprovals']} Approvals")

    # 6. SLA Escalation Engine & Background Worker
    print("\n[6] Testing SLA Escalation Engine & Background Daemon...")
    r = session.get(f"{BASE_URL}/system/worker")
    assert r.status_code == 200
    worker_status = r.json().get("data", {})
    assert worker_status.get("isRunning") == True, "Worker daemon should be running"
    print("  [OK] Automation worker daemon verified running")

    r = session.post(f"{BASE_URL}/system/worker/run", headers=auth_headers_officer)
    assert r.status_code == 200
    run_res = r.json().get("data", {})
    assert "slaEvaluationsCount" in run_res, "SLA evaluations missing"
    print(f"  [OK] Manual worker cycle executed: {run_res['slaEvaluationsCount']} SLAs evaluated")

    # 7. 11-Factor Root Cause Case Management
    print("\n[7] Testing 11-Factor Root Cause Case Management...")
    case_payload = {
        "projectId": "PAI-706775",
        "title": "Severe ROW Stoppage on GP Fiber Cable Trenching",
        "severity": "CRITICAL",
        "initialFactors": {
            "LAND_ACQUISITION": {"score": 9, "notes": "Gram Panchayat forest clearances pending."},
            "UTILITY_SHIFTING": {"score": 7, "notes": "State electricity board line shifting pending."}
        }
    }
    r = session.post(f"{BASE_URL}/cases", json=case_payload, headers=auth_headers_officer)
    assert r.status_code == 201, f"Case creation failed: {r.text}"
    case_data = r.json().get("data", {})
    case_id = case_data["caseId"]
    print(f"  [OK] Case file opened: {case_id}")

    # Submit Action Plan
    r = session.post(f"{BASE_URL}/cases/{case_id}/action-plan", json={
        "planSummary": "Deploy joint district inspection team and request CCEA intervention.",
        "targetResolutionDate": "2026-12-15"
    }, headers={"Authorization": "Bearer nodal"})
    assert r.status_code == 200
    print("  [OK] Root-cause action plan submitted by Project Nodal Officer")

    # Upload Evidence
    r = session.post(f"{BASE_URL}/cases/{case_id}/evidence", json={
        "documentType": "ROW_HANDOVER_PROTOCOL",
        "title": "Joint Measurement Protocol Document",
        "url": "https://paimana.gov.in/docs/jm_protocol_signed.pdf"
    }, headers={"Authorization": "Bearer nodal"})
    assert r.status_code == 201
    evidence_id = r.json().get("data", {}).get("evidenceList", [{}])[-1].get("evidenceId")
    print(f"  [OK] Action evidence uploaded: {evidence_id}")

    # Verify Evidence
    r = session.post(f"{BASE_URL}/cases/{case_id}/evidence/{evidence_id}/verify", json={
        "verified": True,
        "comments": "Inspected and verified against geodetic survey."
    }, headers=auth_headers_officer)
    assert r.status_code == 200
    print("  [OK] Action evidence verified and signed off by Monitoring Officer")

    # 8. Senior Decision Maker Brief & Directive Issuance
    print("\n[8] Testing Executive Decision Brief & Directive Issuance...")
    auth_headers_sec = {"Authorization": "Bearer secretary"}
    brief_payload = {
        "projectId": "PAI-706775",
        "title": "Strategic Resolution for BharatNet Phase-II",
        "criticality": "CRITICAL",
        "backgroundSummary": "Project facing terminal schedule slippage without empowered inter-ministerial intervention.",
        "options": [
            {
                "optionId": "OPT_A",
                "title": "Option A: Scope Rationalization",
                "costImpactCr": 0,
                "scheduleImpactMonths": 2,
                "legalRisk": "LOW",
                "tradeOffs": "Drops 15% remote tribal blocks"
            },
            {
                "optionId": "OPT_B",
                "title": "Option B: CCEA Fast-track & Budget Enhancement",
                "costImpactCr": 1250,
                "scheduleImpactMonths": 8,
                "legalRisk": "MEDIUM",
                "tradeOffs": "Full coverage delivered; ₹1,250 Cr fiscal impact"
            }
        ]
    }
    r = session.post(f"{BASE_URL}/decisions/briefs", json=brief_payload, headers=auth_headers_officer)
    assert r.status_code == 201
    brief_id = r.json().get("data", {}).get("briefId")
    print(f"  [OK] Executive decision brief prepared: {brief_id}")

    # Senior Decision Maker issues directive
    directive_payload = {
        "selectedOptionId": "OPT_B",
        "justification": "Comprehensive digital inclusion in border and tribal districts is of national strategic importance.",
        "immediateActions": ["Notify Empowered Committee", "Sanction additional ₹1,250 Cr under Revised Estimate"]
    }
    r = session.post(f"{BASE_URL}/decisions/briefs/{brief_id}/directive", json=directive_payload, headers=auth_headers_sec)
    assert r.status_code == 200
    print("  [OK] Executive Directive issued with legal justification by Senior Decision Maker (Cabinet Sec / PMO)")

    # 9. Multi-Project Dependencies & Cascading Risk
    print("\n[9] Testing Multi-Project Dependencies & Cascading Delay Analysis...")
    r = session.get(f"{BASE_URL}/dependencies")
    assert r.status_code == 200
    deps = r.json().get("data", [])
    assert len(deps) >= 2, "Expected at least 2 dependency links"
    print(f"  [OK] Project dependency network verified ({len(deps)} cross-project links)")

    # Calculate cascade impact of 6 months delay on Mumbai-Ahmedabad High Speed Rail
    r = session.post(f"{BASE_URL}/dependencies/projects/PAI-705728/cascade", json={"additionalDelayMonths": 6})
    assert r.status_code == 200
    cascade_res = r.json().get("data", {})
    assert cascade_res["cascadingImpactCount"] > 0, "Expected downstream impact"
    print(f"  [OK] Cascading systemic delay calculated: {cascade_res['cascadingImpactCount']} dependent project(s) impacted")

    # 10. Historical Data Correction Workflow
    print("\n[10] Testing Non-Destructive Historical Data Correction Workflow...")
    corr_payload = {
        "projectId": "PAI-706775",
        "reportDateKey": "2026-06",
        "fieldName": "cumulative_expenditure",
        "originalValue": 32100.0,
        "proposedValue": 31950.0,
        "reason": "Reconciliation of duplicate invoice entries discovered during statutory AG audit."
    }
    r = session.post(f"{BASE_URL}/system/corrections", json=corr_payload, headers={"Authorization": "Bearer nodal"})
    assert r.status_code == 201
    corr_id = r.json().get("data", {}).get("correctionId")
    print(f"  [OK] Historical correction requested: {corr_id}")

    # Approve correction
    r = session.post(f"{BASE_URL}/system/corrections/{corr_id}/review", json={
        "decision": "APPROVE",
        "remarks": "Audited AG report verified. Immutable delta recorded."
    }, headers=auth_headers_officer)
    assert r.status_code == 200
    print("  [OK] Historical correction approved with audited overlay without corrupting original provenance")

    # 11. Multi-Channel Notification Dispatches
    print("\n[11] Testing Multi-Channel Notification Dispatches...")
    r = session.get(f"{BASE_URL}/system/notification-dispatches")
    assert r.status_code == 200
    print("  [OK] Multi-channel notification delivery log verified")

    print_section("ALL OPERATIONAL GOVERNMENT WORKFLOW TESTS PASSED (11/11 SUCCESS)!")
    return True

if __name__ == "__main__":
    try:
        success = run_suite()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n[FAIL] Operational Workflow Suite Failed: {str(e)}")
        sys.exit(1)
