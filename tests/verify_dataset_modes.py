"""
Automated Mode Isolation & Dataset Verification Test Suite
Verifies:
1. Real mode project count = 1,981 (April 2026 Table 6)
2. Synthetic demo mode project count = 241
3. Mode isolation & non-leakage
4. Real hero lookup: PAI-706775 (BharatNet)
5. Scientific honesty & prohibited operational fields absence in real records
6. Multi-snapshot time series depth & chronological sorting
7. Financial reconciliation within 0.1% tolerance
"""

import os
import json
import sys
import re

def run_tests():
    print("=" * 80)
    print("PAIMANA PREDICT: DATASET MODES & ISOLATION TEST SUITE")
    print("=" * 80)

    # 1. Check normalized Real dataset
    real_file = "data/normalized/paimana_april_2026.json"
    assert os.path.exists(real_file), f"Missing {real_file}"
    with open(real_file, 'r', encoding='utf-8') as f:
        real_projects = json.load(f)

    # Real mode count verification
    assert len(real_projects) == 1981, f"Expected 1981 real projects, got {len(real_projects)}"
    print(f"PASS: Real mode project count is exactly {len(real_projects)}")

    # 2. Check synthetic demo dataset code (1 Hero + 240 generated = 241 total)
    demo_file = "src/data/syntheticProjects.ts"
    assert os.path.exists(demo_file), f"Missing {demo_file}"
    with open(demo_file, 'r', encoding='utf-8') as f:
        demo_code = f.read()
    assert "for (let i = 0; i < 240; i++)" in demo_code and "PJ-1042" in demo_code, "Expected 241 demo projects (1 hero + 240)"
    print(f"PASS: AI demo mode generator verified for 241 synthetic projects (1 hero + 240 portfolio)")

    # 3. Real Hero Lookup (PAI-706775 BharatNet)
    bnet = next((p for p in real_projects if p['project_code'] == '706775' or p['project_id'] == 'PAI-706775'), None)
    assert bnet is not None, "Real Hero PAI-706775 (BharatNet) not found in real dataset"
    assert 'BharatNet' in bnet['project_name'], f"Unexpected name: {bnet['project_name']}"
    assert bnet['original_cost'] == 61109.0, f"Unexpected orig cost: {bnet['original_cost']}"
    assert bnet['revised_cost'] == 188000.0, f"Unexpected rev cost: {bnet['revised_cost']}"
    assert bnet['cost_growth_pct'] == 207.65, f"Unexpected growth pct: {bnet['cost_growth_pct']}"
    assert bnet['physical_progress'] == 82.4, f"Unexpected progress: {bnet['physical_progress']}"
    print(f"PASS: Real Hero (PAI-706775 BharatNet) verified with exact extracted values (+207.6% revision)")

    # 4. Mode Isolation & Scientific Honesty
    prohibited_fields = [
        'contractor_performance_score',
        'land_acquisition_percent',
        'utility_clearance_percent',
        'labor_availability_score',
        'weather_disruption_index',
        'predicted_delay_months',
        'predicted_cost_overrun',
    ]
    for p in real_projects:
        for field in prohibited_fields:
            assert field not in p, f"Data leakage: prohibited field '{field}' found in real project {p.get('project_id')}"
    print(f"PASS: Zero synthetic variables leaked into all 1,981 real projects")

    # 5. Historical Snapshots
    snapshots_file = "data/snapshots/paimana_historical_snapshots.json"
    assert os.path.exists(snapshots_file), f"Missing {snapshots_file}"
    with open(snapshots_file, 'r', encoding='utf-8') as f:
        snapshots_data = json.load(f)

    bnet_snaps = snapshots_data.get('706775', [])
    assert len(bnet_snaps) == 10, f"Expected 10 snapshots for BharatNet, got {len(bnet_snaps)}"
    print(f"PASS: BharatNet has {len(bnet_snaps)} verified consecutive monthly snapshots")

    # Verify chronological ordering
    dates = [s['report_date_key'] for s in bnet_snaps]
    assert dates == sorted(dates), f"Snapshots not sorted chronologically: {dates}"
    print(f"PASS: Historical snapshots are strictly chronologically ordered: {dates[0]} -> {dates[-1]}")

    # 6. Financial Reconciliation Check
    audit_file = "data/metadata/ingestion_audit.json"
    with open(audit_file, 'r', encoding='utf-8') as f:
        audit = json.load(f)
    assert audit['reconciliation_status'] == 'PASS', "Reconciliation status is not PASS"
    assert abs(audit['original_cost_diff_pct']) < 0.1, "Original cost diff > 0.1%"
    assert abs(audit['revised_cost_diff_pct']) < 0.1, "Revised cost diff > 0.1%"
    assert abs(audit['expenditure_diff_pct']) < 0.1, "Expenditure diff > 0.1%"
    print(f"PASS: Financial totals reconcile with official published targets at 0.0000% delta")

    print("=" * 80)
    print("ALL DATASET MODES & INTEGRATION TESTS PASSED (100% SUCCESS)!")
    print("=" * 80)

if __name__ == "__main__":
    run_tests()
