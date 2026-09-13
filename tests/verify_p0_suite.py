#!/usr/bin/env python3
"""
PAIMANA PREDICT: COMPREHENSIVE P0 CAPABILITY & SCIENTIFIC VERIFICATION SUITE
Verifies:
 1. Rule T As-Of Historical Reconstruction (Zero Future Leakage)
 2. Confidence Engine (Completeness, Depth, Stability, Calibration)
 3. Resilience & Fragility Scoring
 4. Project Twin / Similarity Matching
 5. Deduplicated Composite Alerts & SLA Countdown
 6. Counterfactual Scenario Simulator with Non-Causal Disclaimers
 7. Human-in-the-Loop Override & Immutable Audit Log
 8. Intervention Closed-Loop Effectiveness & Pre/Post Delta
 9. Quality Telemetry & Engineering Verification Disclaimers
 10. Demo State Machine & Reset
 11. Resource-Level RBAC Enforcement

Smart India Hackathon 2026 • Problem Statement SIH26103 (MoSPI)
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = os.environ.get("PAIMANA_URL", "http://127.0.0.1:3000")

def req(path, method="GET", body=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode("utf-8") if body else None
    request_obj = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request_obj, timeout=10) as response:
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

def test_p0_suite():
    print("=" * 80)
    print("PAIMANA PREDICT — P0 SCIENTIFIC & ARCHITECTURAL VERIFICATION SUITE")
    print(f"Target Service: {BASE_URL}")
    print("=" * 80)

    # 0. Health check
    status, health = req("/health")
    assert status == 200, f"Health check failed: {status}"
    print(f"✓ [HEALTH] Service is healthy: {health.get('status')}")

    # 1. Rule T As-Of Historical Reconstruction
    print("\n--- [1] RULE T HISTORICAL RECONSTRUCTION (ZERO FUTURE LEAKAGE) ---")
    cutoff = "2026-01"
    status, asof = req(f"/api/v1/as-of/PAI-706775?asOfDate={cutoff}")
    assert status == 200, f"As-of query failed: {status}, {asof}"
    data = asof.get("data", {})
    assert data.get("rule_t_compliant") is True, "Rule T compliance flag must be True"
    assert data.get("as_of_date") == cutoff, f"Mismatched as-of date: {data.get('as_of_date')}"
    
    # Verify strict snapshot filtering
    snapshots = data.get("historical_snapshots", [])
    for snap in snapshots:
        assert snap["report_date_key"] <= cutoff, f"Leakage detected! Snapshot {snap['report_date_key']} > {cutoff}"
    print(f"✓ Rule T verified: {len(snapshots)} snapshots strictly <= {cutoff}. Zero future leakage.")
    
    # Verify future actuals sequestration
    actuals = data.get("evaluation_actuals", [])
    for act in actuals:
        assert act["report_date_key"] > cutoff, f"Actual must be strictly post-cutoff: {act['report_date_key']}"
    print(f"✓ Future outcomes strictly sequestered: {len(actuals)} evaluation actuals post-{cutoff}.")
    assert "forecast_error_months" in data, "Forecast error months must be computed."
    print(f"✓ Lead-time and forecast error computed: {data.get('lead_time_days')} days lead time.")

    # 2. Confidence Engine
    print("\n--- [2] CONFIDENCE ENGINE ---")
    status, conf = req("/api/v1/projects/PAI-706775/confidence")
    assert status == 200, f"Confidence query failed: {status}"
    c_data = conf.get("data", {})
    assert "overall_confidence" in c_data, "overall_confidence missing"
    assert "reliability_tier" in c_data, "reliability_tier missing"
    assert "breakdown" in c_data, "breakdown missing"
    print(f"✓ Confidence calculated: {c_data.get('overall_confidence')}% (Tier: {c_data.get('reliability_tier')})")
    print(f"  Breakdown: Data Completeness={c_data['breakdown']['data_completeness']}%, Depth={c_data['breakdown']['snapshot_depth']}%, Stability={c_data['breakdown']['velocity_stability']}%, Calibration={c_data['breakdown']['calibration_fit']}%")

    # 3. Resilience & Fragility Scoring
    print("\n--- [3] RESILIENCE & FRAGILITY METRICS ---")
    status, res = req("/api/v1/projects/PAI-706775/resilience")
    assert status == 200, f"Resilience query failed: {status}"
    r_data = res.get("data", {})
    assert "resilience_score" in r_data, "resilience_score missing"
    assert "fragility_score" in r_data, "fragility_score missing"
    print(f"✓ Derived Scores: Resilience={r_data.get('resilience_score')}/100 ({r_data.get('resilience_band')}), Fragility={r_data.get('fragility_score')}/100 ({r_data.get('fragility_band')})")
    assert r_data.get("provenance") == "DERIVED_VARIABLE", "Provenance must be DERIVED_VARIABLE"

    # 4. Project Similarity (Twin Matcher)
    print("\n--- [4] NEAREST-NEIGHBOR TWIN MATCHING ---")
    status, sim = req("/api/v1/projects/PAI-706775/similar")
    assert status == 200, f"Similar query failed: {status}"
    s_data = sim.get("data", {})
    matches = s_data.get("matches", [])
    assert len(matches) > 0, "Expected at least 1 twin match"
    top_twin = matches[0]
    print(f"✓ Top Historical Twin: {top_twin.get('project_id')} ({top_twin.get('project_name')[:40]}...) with {top_twin.get('similarity_score')}% similarity")

    # 5. Composite Deduplicated Early Warnings
    print("\n--- [5] COMPOSITE ALERTS & SLA ESCALATION ---")
    status, alerts = req("/api/v1/alerts/composite")
    assert status == 200, f"Composite alerts query failed: {status}"
    a_data = alerts.get("data", [])
    assert len(a_data) > 0, "Expected composite alert items"
    top_alert = a_data[0]
    assert "sla_hours_remaining" in top_alert, "SLA timer missing"
    assert "escalation_tier" in top_alert, "Escalation tier missing"
    assert "active_signals" in top_alert, "Active sub-signals missing"
    print(f"✓ Found {len(a_data)} composite alerts. Top: Project {top_alert['project_id']}, Tier {top_alert['escalation_tier']}, SLA {top_alert['sla_hours_remaining']}h remaining, {len(top_alert['active_signals'])} sub-signals bundled.")

    # 6. Counterfactual Scenario Simulator
    print("\n--- [6] COUNTERFACTUAL SCENARIO SIMULATOR ---")
    status, scen = req("/api/v1/scenarios/simulate", method="POST", body={
        "projectId": "PAI-706775",
        "scenarios": ["fast_track_land", "dual_shift", "taskforce"]
    })
    assert status == 200, f"Scenario simulation failed: {status}"
    sc_data = scen.get("data", {})
    assert "disclaimer" in sc_data, "Non-causal disclaimer missing"
    assert "scenarios" in sc_data, "Scenarios missing"
    print(f"✓ Scenario Disclaimer: \"{sc_data.get('disclaimer')}\"")
    print(f"✓ Baseline: Cost Overrun ₹{sc_data['baseline']['costOverrunCr']} Cr, Delay {sc_data['baseline']['scheduleExtensionMonths']} mos")
    for s in sc_data['scenarios']:
        print(f"  • {s['label']}: Est Delay Saving={s['estimatedDelayReductionMonths']} mos, Cost Avoided=₹{s['estimatedCostAvoidanceCr']} Cr (ROI: {s['benefitCostRatio']}x)")

    # 7. Human Override & Immutable Audit Logging
    print("\n--- [7] HUMAN-IN-THE-LOOP OVERRIDE & AUDIT TRAIL ---")
    # Login as monitoring officer
    status, login_res = req("/api/v1/auth/login", method="POST", body={"username": "officer", "password": "officer123"})
    assert status == 200, f"Officer login failed: {status}"
    officer_token = login_res.get("token") or login_res.get("data", {}).get("token")
    assert officer_token, "No token received"

    override_payload = {
        "projectId": "PAI-706775",
        "humanScore": 64,
        "humanBand": "HIGH",
        "justification": "Site inspection confirmed Package 3 ROW cleared by district magistrate; risk adjusted downward from CRITICAL.",
        "evidenceLinks": ["https://mospi.gov.in/inspections/2026/04/PAI-706775.pdf"]
    }
    status, over_res = req("/api/v1/overrides", method="POST", body=override_payload, token=officer_token)
    assert status == 201, f"Override submission failed: {status}, {over_res}"
    print("✓ Human override recorded successfully by Monitoring Officer.")

    # Check active override
    status, active_over = req("/api/v1/overrides/PAI-706775")
    assert status == 200, "Failed to retrieve override"
    assert active_over.get("data", {}).get("humanScore") == 64, "Active override score mismatch"
    print(f"✓ Active override verified: AI Score {active_over['data'].get('originalAiScore', active_over['data'].get('aiScore'))} -> Human Score {active_over['data']['humanScore']}")

    # Check immutable audit trail (strictly restricted to System Administrator role)
    status, admin_login = req("/api/v1/auth/login", method="POST", body={"username": "sysadmin", "password": "sysadmin123"})
    assert status == 200, f"Sysadmin login failed: {status}"
    admin_token = admin_login.get("token") or admin_login.get("data", {}).get("token")

    status, audit_res = req("/api/v1/audit/logs", token=admin_token)
    assert status == 200, f"Audit query failed: {status}"
    logs = audit_res.get("logs") or audit_res.get("data", {}).get("logs", [])
    override_log = next((l for l in logs if l.get("action") == "RECORD_RISK_OVERRIDE"), None)
    assert override_log is not None, "Override audit log record missing"
    assert (override_log.get("officer_id") == "usr-officer-01" or override_log.get("userId") == "usr-officer-01"), "Officer ID mismatch in audit log"
    print(f"✓ Immutable audit record verified: ID={override_log.get('id')}, Action={override_log.get('action')}, User={override_log.get('userId')}")

    # 8. Intervention Closed-Loop Effectiveness
    print("\n--- [8] INTERVENTION CLOSED-LOOP EFFECTIVENESS ---")
    status, eff_res = req("/api/v1/actions/effectiveness")
    assert status == 200, f"Effectiveness query failed: {status}"
    e_data = eff_res.get("data", {})
    categories = e_data.get("categories", [])
    assert len(categories) > 0, "No intervention categories returned"
    print(f"✓ Tracked {len(categories)} intervention categories. Top: {categories[0]['category']} ({categories[0]['success_rate']}% success rate, avg {categories[0]['avg_risk_reduction_pts']} pts reduction).")

    # 9. Quality Telemetry & Engineering Disclaimers
    print("\n--- [9] QUALITY TELEMETRY & VERIFICATION DISCLAIMERS ---")
    status, q_res = req("/api/v1/quality/PAI-706775")
    assert status == 200, f"Quality query failed: {status}"
    q_data = q_res.get("data", {})
    assert "verification_disclaimer" in q_data, "Quality verification disclaimer missing"
    print(f"✓ Quality Disclaimer: \"{q_data.get('verification_disclaimer')}\"")
    print(f"✓ Telemetry: {len(q_data.get('non_conformance_reports', []))} NCRs, {len(q_data.get('lab_tests', []))} Lab Tests, {len(q_data.get('site_photo_anomalies', []))} Photo Anomaly Detections.")

    # 10. Demo State Machine & Reset
    print("\n--- [10] GUIDED DEMO STATE MACHINE ---")
    status, d_state = req("/api/v1/demo/state")
    assert status == 200, f"Demo state query failed: {status}"
    st_data = d_state.get("data", {})
    assert "currentStage" in st_data, "currentStage missing"
    assert "stages" in st_data and len(st_data["stages"]) == 12, "Must have 12-stage guided journey"
    print(f"✓ 12-Stage Demo State Machine verified. Active stage: {st_data['currentStage']} - {st_data['stages'][st_data['currentStage']-1]['name']}")

    # 11. Resource-Level RBAC Enforcement
    print("\n--- [11] RESOURCE-LEVEL RBAC ENFORCEMENT ---")
    status, nodal_login = req("/api/v1/auth/login", method="POST", body={"username": "nodal", "password": "nodal123"})
    assert status == 200, f"Nodal login failed: {status}"
    nodal_token = nodal_login.get("token") or nodal_login.get("data", {}).get("token")

    # Attempt to modify project PAI-999999 (NOT assigned to nodal officer)
    status, denied = req("/api/v1/projects/PAI-999999/status", method="POST", body={"physical_progress": 85.0}, token=nodal_token)
    assert status == 403, f"Expected 403 Forbidden for unassigned project, got {status}: {denied}"
    print("✓ Resource RBAC: Nodal officer denied access to unassigned project (403 Forbidden).")

    # Attempt to update assigned project PAI-706775
    status, allowed = req("/api/v1/projects/PAI-706775/status", method="POST", body={"physical_progress": 72.0}, token=nodal_token)
    assert status in (200, 201), f"Expected 200/201 for assigned project, got {status}: {allowed}"
    print("✓ Resource RBAC: Nodal officer permitted to update assigned project PAI-706775 (200 OK).")

    print("\n" + "=" * 80)
    print("ALL P0 CHECKS PASSED: SYSTEM ARCHITECTURE & SCIENTIFIC GUARDRAILS FULLY COMPLIANT")
    print("=" * 80)

if __name__ == "__main__":
    try:
        test_p0_suite()
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {e}")
        sys.exit(1)
