import sys
import os
import json
import pandas as pd

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print("="*80)
print("PAIMANA AUTHENTIC INGESTION & DATA GOVERNANCE TEST SUITE")
print("="*80)

failures = []

def assert_test(condition, test_name, error_msg=""):
    if condition:
        print(f"PASS: {test_name}")
    else:
        print(f"FAIL: {test_name} - {error_msg}")
        failures.append(f"{test_name}: {error_msg}")

# 1. Check Canonical Files Existence
audit_file = 'data/metadata/ingestion_audit.json'
normalized_file = 'data/normalized/paimana_april_2026.json'
parquet_file = 'data/normalized/paimana_projects.parquet'
snapshots_file = 'data/snapshots/paimana_historical_snapshots.json'
summary_file = 'data/normalized/paimana_portfolio_summary.json'

assert_test(os.path.exists(audit_file), "Ingestion audit metadata exists")
assert_test(os.path.exists(normalized_file), "Normalized April 2026 JSON exists")
assert_test(os.path.exists(parquet_file), "Normalized April 2026 Parquet exists")
assert_test(os.path.exists(snapshots_file), "Historical snapshots JSON exists")
assert_test(os.path.exists(summary_file), "Portfolio summary JSON exists")

if os.path.exists(audit_file):
    with open(audit_file, 'r', encoding='utf-8') as f:
        audit = json.load(f)
    
    # 2. Project Count Verification (Target = 1981)
    assert_test(audit.get('rows_extracted') == 1981, "April 2026 Project Count is exactly 1,981", f"Got {audit.get('rows_extracted')}")
    assert_test(audit.get('missing_project_codes') == 0, "Zero missing project codes in April 2026", f"Got {audit.get('missing_project_codes')}")
    assert_test(audit.get('duplicate_project_codes') == 0, "Zero duplicate project codes in April 2026", f"Got {audit.get('duplicate_project_codes')}")
    
    # 3. Source Reconciliation (Tolerance <= 0.1%)
    assert_test(audit.get('original_cost_diff_pct', 100) <= 0.1, "Original Cost reconciles within 0.1%", f"Diff: {audit.get('original_cost_diff_pct')}%")
    assert_test(audit.get('revised_cost_diff_pct', 100) <= 0.1, "Revised Cost reconciles within 0.1%", f"Diff: {audit.get('revised_cost_diff_pct')}%")
    assert_test(audit.get('expenditure_diff_pct', 100) <= 0.1, "Cumulative Expenditure reconciles within 0.1%", f"Diff: {audit.get('expenditure_diff_pct')}%")
    assert_test(audit.get('reconciliation_status') == 'PASS', "Reconciliation Status is PASS", f"Status: {audit.get('reconciliation_status')}")

# 4. Field Semantics & Scientific Honesty Verification
if os.path.exists(normalized_file):
    with open(normalized_file, 'r', encoding='utf-8') as f:
        projects = json.load(f)
        
    assert_test(len(projects) == 1981, "Normalized JSON contains exactly 1,981 records", f"Got {len(projects)}")
    
    # Check that fabricated operational variables DO NOT exist in real dataset
    prohibited_fields = [
        'contractor_performance_score',
        'land_acquisition_percent',
        'utility_clearance_percent',
        'labor_availability_score',
        'weather_disruption_index',
        'statutory_clearances_completed'
    ]
    sample_proj = projects[0]
    for pf in prohibited_fields:
        assert_test(pf not in sample_proj, f"Scientific Honesty: Prohibited field '{pf}' is absent from real record")
        
    # Check provenance on sample
    assert_test('provenance' in sample_proj and sample_proj['provenance'].get('source_document') == 'FlashReport_April2026.pdf',
                "Provenance tracking correctly identifies source document")

# 5. Historical Snapshots Verification
if os.path.exists(snapshots_file):
    with open(snapshots_file, 'r', encoding='utf-8') as f:
        snapshots = json.load(f)
    assert_test(len(snapshots) > 1000, "Historical snapshots extracted for over 1,000 projects", f"Got {len(snapshots)}")
    
    # Check temporal ordering
    sample_code = list(snapshots.keys())[0]
    snaps_list = snapshots[sample_code]
    date_keys = [s['report_date_key'] for s in snaps_list]
    assert_test(date_keys == sorted(date_keys), "Historical snapshots are strictly chronologically ordered")

print("="*80)
if not failures:
    print("ALL PAIMANA INGESTION & DATA GOVERNANCE TESTS PASSED (100% SUCCESS)!")
    sys.exit(0)
else:
    print(f"TEST SUITE FAILED WITH {len(failures)} ERROR(S):")
    for fl in failures:
        print(f"  - {fl}")
    sys.exit(1)
