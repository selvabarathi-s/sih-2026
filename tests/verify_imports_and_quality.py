#!/usr/bin/env python3
"""
PAIMANA PREDICT — SUITE 20: DATA INGESTION PIPELINE & QUALITY COMPLIANCE VERIFICATION
Tests:
  1. Multi-format Ingestion, Mapping Templates & Pre-Flight Validation Engine
  2. Duplicate Detection in Import Staging & Governed Batch Publication
  3. Non-Conformance Reports (NCR) 6-Stage Lifecycle & Rework Verification
  4. Certified Laboratory Test Ledger (IS 516 / IS 1786 Indian Standards)
  5. Site Photo Visual Telemetry & Scientific Verification Disclaimers
  6. Dynamic Quality Risk Recalculation & Inter-Project Cascade Delay Simulation
"""

import sys
import os
import requests
import json
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = 'http://127.0.0.1:3000'
ADMIN_HEADERS = {'Authorization': 'Bearer admin', 'Content-Type': 'application/json'}
OFFICER_HEADERS = {'Authorization': 'Bearer officer', 'Content-Type': 'application/json'}

def run_tests():
    print("======================================================================")
    print("PAIMANA PREDICT: SUITE 20 — DATA INGESTION & QUALITY COMPLIANCE")
    print("======================================================================")

    # 1. Templates
    print("\n[1] Testing Data Ingestion Mapping Templates...")
    r = requests.get(f"{BASE_URL}/api/v1/imports/templates", headers=ADMIN_HEADERS)
    assert r.status_code == 200, f"Templates failed: {r.status_code}"
    templates = r.json().get('data', [])
    assert len(templates) >= 4, f"Expected at least 4 templates, got {len(templates)}"
    tpl_ids = [t['id'] for t in templates]
    assert 'tpl-mospi-paimana' in tpl_ids
    assert 'tpl-state-pwd' in tpl_ids
    print(f"  [OK] Found {len(templates)} schema mapping templates: {', '.join(tpl_ids)}")

    # 2. Pre-flight Validation & Duplicate Detection
    print("\n[2] Testing Pre-Flight Validation & Duplicate Detection...")
    import uuid
    import random
    rand_int = random.randint(100000, 999999)
    proj_name = f"Novel-Greenfield-Installation-{rand_int}"
    agency_name = f"Special-Purpose-Vehicle-{rand_int}"
    csv_data = f"""Project Name,Sector,Ministry,State,Implementing Agency,Original Cost (Cr),Cumulative Expenditure (Cr),Physical Progress (%)
BharatNet Phase-II (Maharashtra Sector),Road Transport and Highways,Ministry of Communications,Maharashtra,BBNL,4000.00,1200.00,45.0
{proj_name},Renewable Energy,Ministry of New and Renewable Energy,Sikkim,{agency_name},850.00,120.00,18.5
Invalid Row Missing Title,,Ministry of Power,National,NTPC,-50.00,10.00,110.0"""

    r = requests.post(f"{BASE_URL}/api/v1/imports/preview", headers=ADMIN_HEADERS, json={
        'filename': 'test_telemetry_stream.csv',
        'rawData': csv_data,
        'fileType': 'csv',
        'templateId': 'tpl-mospi-paimana'
    })
    assert r.status_code == 200, f"Preview failed: {r.status_code}"
    batch = r.json().get('data', {})
    batch_id = batch.get('batchId')
    assert (batch.get('validRows', 0) + batch.get('warningRows', 0)) >= 2, f"Expected at least 2 non-rejected rows, got {batch}"
    assert batch.get('rejectedRows') >= 1, "Expected row 3 to be rejected due to negative cost and >100% progress"
    assert batch.get('warningRows') >= 1, "Expected row 1 to be flagged with duplicate warning against BharatNet"

    row1 = batch['stagedRows'][0]
    assert row1['status'] == 'WARNING'
    assert row1['duplicateMatch'] is not None
    assert row1['duplicateMatch']['isDuplicate'] is True
    print(f"  [OK] Pre-flight pipeline correctly staged: Valid={batch['validRows']}, Warning={batch['warningRows']}, Rejected={batch['rejectedRows']}")
    print(f"  [OK] Duplicate detection correctly flagged: {row1['duplicateMatch']['matchedProject']['project_name']} ({row1['duplicateMatch']['matchScore']}% match)")

    # 3. Batch Publication
    print("\n[3] Testing Governed Batch Publication & Audit Log...")
    r = requests.post(f"{BASE_URL}/api/v1/imports/{batch_id}/commit", headers=ADMIN_HEADERS, json={'includeWarnings': True})
    assert r.status_code == 200, f"Commit failed: {r.status_code}"
    commit_res = r.json().get('data', {})
    assert commit_res.get('committedCount') >= 1
    print(f"  [OK] Committed {commit_res.get('committedCount')} project masters into active repository.")

    # 4. Import History
    r = requests.get(f"{BASE_URL}/api/v1/imports/history", headers=ADMIN_HEADERS)
    assert r.status_code == 200
    history = r.json().get('data', [])
    assert any(h['batchId'] == batch_id for h in history)
    print("  [OK] Batch publication recorded in permanent audit ledger.")

    # 5. Quality Summary & Project Quality Data
    print("\n[4] Testing Quality & Compliance Intelligence Engine...")
    r = requests.get(f"{BASE_URL}/api/v1/quality/summary")
    assert r.status_code == 200
    summary = r.json().get('data', {})
    assert 'labPassRate' in summary
    assert 'totalNcrs' in summary
    print(f"  [OK] Portfolio Quality Summary: {summary['totalNcrs']} NCRs, {summary['labPassRate']} Lab Conformance")

    r = requests.get(f"{BASE_URL}/api/v1/quality/PAI-706775")
    assert r.status_code == 200
    p_quality = r.json().get('data', {})
    assert p_quality.get('verification_disclaimer') is not None
    assert len(p_quality.get('ncrs', [])) >= 2
    assert len(p_quality.get('labTests', [])) >= 4
    print(f"  [OK] Project PAI-706775 Quality Telemetry: Quality Risk Score={p_quality.get('qualityRiskScore')}/100, Band={p_quality.get('qualityRiskBand')}")

    # 6. NCR Lifecycle & Rework
    print("\n[5] Testing Non-Conformance Report (NCR) Lifecycle...")
    r = requests.post(f"{BASE_URL}/api/v1/quality/PAI-706775/ncrs", headers=OFFICER_HEADERS, json={
        'title': 'Bridge Sub-structure Concrete Honeycombing (Pier P-18)',
        'severity': 'CRITICAL',
        'contractor': 'Afcons Infrastructure',
        'finding': 'Superficial honeycombing observed at pier stem concrete joint exceeding 25mm depth.'
    })
    assert r.status_code == 201, f"Create NCR failed: {r.status_code}"
    new_ncr = r.json().get('data', {})
    ncr_id = new_ncr.get('id')
    assert new_ncr.get('status') == 'RAISED'
    assert new_ncr.get('severity') == 'CRITICAL'
    print(f"  [OK] Raised CRITICAL NCR: {ncr_id} — {new_ncr.get('title')}")

    # Check that quality risk updated
    r = requests.get(f"{BASE_URL}/api/v1/quality/PAI-706775")
    updated_quality = r.json().get('data', {})
    assert updated_quality['qualityRiskScore'] > p_quality['qualityRiskScore'], "Quality risk score must increase upon adding critical NCR"
    print(f"  [OK] Quality risk dynamically increased: {p_quality['qualityRiskScore']} -> {updated_quality['qualityRiskScore']} pts")

    # Update NCR Status through remediation
    r = requests.patch(f"{BASE_URL}/api/v1/quality/ncrs/{ncr_id}", headers=OFFICER_HEADERS, json={
        'status': 'TPI_LAB_VERIFIED',
        'correctiveAction': 'Pressure grouted with high-strength non-shrink epoxy grout; ultrasonic pulse velocity test confirmed integrity.',
        'testCertificateId': 'CERT-UPV-2026-441'
    })
    assert r.status_code == 200, f"Update NCR failed: {r.status_code}"
    resolved_ncr = r.json().get('data', {})
    assert resolved_ncr.get('status') == 'TPI_LAB_VERIFIED'
    assert resolved_ncr.get('verificationStatus') == 'CONFIRMED_AND_RECTIFIED'
    print(f"  [OK] NCR {ncr_id} resolved with third-party lab verification: {resolved_ncr['testCertificateId']}")

    # 7. Lab Tests & Site Photos
    print("\n[6] Testing Certified Lab Test Ledger & Photo Telemetry...")
    r = requests.post(f"{BASE_URL}/api/v1/quality/PAI-706775/lab-tests", headers=OFFICER_HEADERS, json={
        'testName': 'Bituminous Concrete Marshall Stability',
        'standard': 'IRC:SP:79',
        'spec': 'Stability >= 12.0 kN @ 60°C',
        'result': '14.8 kN',
        'status': 'PASS',
        'lab': 'Central Road Research Institute (CRRI)'
    })
    assert r.status_code == 201
    lab_test = r.json().get('data', {})
    assert lab_test.get('status') == 'PASS'
    print(f"  [OK] Certified Lab Test Recorded: {lab_test['testName']} ({lab_test['standard']}) -> {lab_test['status']}")

    r = requests.post(f"{BASE_URL}/api/v1/quality/PAI-706775/site-photos", headers=OFFICER_HEADERS, json={
        'title': 'Girder Alignment Visual Discrepancy Flag',
        'location': 'Pier P-44 Span 3',
        'anomalyConfidence': 88,
        'anomalyLabel': 'Possible Bearing Pad Eccentricity'
    })
    assert r.status_code == 201
    photo = r.json().get('data', {})
    photo_id = photo.get('id')
    assert photo.get('disclaimer') is not None
    print(f"  [OK] Site Visual Telemetry Flagged: {photo['anomalyLabel']} (Confidence: {photo['anomalyConfidence']}%)")

    r = requests.patch(f"{BASE_URL}/api/v1/quality/site-photos/{photo_id}/verify", headers=OFFICER_HEADERS, json={
        'isConfirmed': True,
        'verificationNotes': 'Site engineer inspected; bearing pad realigned to standard tolerance.'
    })
    assert r.status_code == 200
    verified_photo = r.json().get('data', {})
    assert verified_photo.get('verificationStatus') == 'CONFIRMED_DEFECT'
    print(f"  [OK] Site Photo Anomaly Verified by Quality Engineer: {verified_photo['verificationStatus']}")

    # 8. Inter-Project Delay Cascade Simulation
    print("\n[7] Testing Systemic Inter-Project Delay Ripple Simulator...")
    r = requests.post(f"{BASE_URL}/api/v1/dependencies/projects/PAI-705728/cascade", json={'additionalDelayMonths': 9})
    assert r.status_code == 200
    cascade = r.json().get('data', {})
    assert cascade.get('assumedDelayMonths') == 9
    assert cascade.get('cascadingImpactCount') >= 1
    impacted = cascade.get('impactedProjects', [])
    assert len(impacted) >= 1
    top_downstream = impacted[0]
    assert top_downstream.get('bufferExceededMonths') > 0
    assert top_downstream.get('estimatedFinancialImpactCr') > 0
    print(f"  [OK] Systemic Delay Cascade: Upstream 9 Mo delay -> Downstream {top_downstream['downstreamProjectName']} slipped by {top_downstream['bufferExceededMonths']} Mo (₹{top_downstream['estimatedFinancialImpactCr']} Cr exposure)")

    print("\n======================================================================")
    print("ALL SUITE 20 TESTS COMPLETED AND PASSED (100% SUCCESS)!")
    print("======================================================================")

if __name__ == '__main__':
    run_tests()
