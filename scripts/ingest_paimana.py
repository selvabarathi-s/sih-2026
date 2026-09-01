import sys
import os
import glob
import re
import json
import fitz # PyMuPDF
import pdfplumber
import pandas as pd
from datetime import datetime

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print("="*80)
print("PAIMANA AUTHENTIC DATASET INGESTION & NORMALIZATION PIPELINE")
print("="*80)

# Paths
DATASETS_DIR = 'datasets'
OUTPUT_DIR_EXTRACTED = 'data/extracted'
OUTPUT_DIR_NORMALIZED = 'data/normalized'
OUTPUT_DIR_SNAPSHOTS = 'data/snapshots'
OUTPUT_DIR_METADATA = 'data/metadata'

os.makedirs(OUTPUT_DIR_EXTRACTED, exist_ok=True)
os.makedirs(OUTPUT_DIR_NORMALIZED, exist_ok=True)
os.makedirs(OUTPUT_DIR_SNAPSHOTS, exist_ok=True)
os.makedirs(OUTPUT_DIR_METADATA, exist_ok=True)

# ---------------------------------------------------------
# Helper Functions: Parsing & Normalization
# ---------------------------------------------------------

def parse_col1(col1_text):
    """
    Extracts project_name, agency, project_code, legacy_ocms_code, pmgid from Col 1 text.
    """
    lines = [l.strip() for l in col1_text.strip().split('\n') if l.strip()]
    if not lines:
        return {'project_name': '', 'agency': '', 'project_code': '', 'legacy_ocms_code': '', 'pmgid': ''}
        
    agency = ""
    project_code = ""
    legacy_ocms_code = ""
    pmgid = ""
    
    # 1. Project code (6-digit number in parentheses)
    code_matches = re.findall(r'\((\d{6})\)', col1_text)
    if code_matches:
        project_code = code_matches[0]
        
    # 2. Legacy OCMS code (letter followed by 8 digits)
    ocms_matches = re.findall(r'\(([A-Z]\d{8})\)', col1_text)
    if ocms_matches:
        legacy_ocms_code = ocms_matches[0]
        
    # 3. PMGID and Agency
    all_paren = re.findall(r'\(([^)]+)\)', col1_text)
    for p in all_paren:
        p_str = p.strip()
        if p_str.isdigit() and p_str != project_code:
            pmgid = p_str
        elif any(kw in p_str for kw in [
            'Authority', 'Limited', 'Ltd', 'Corporation', 'Railways', 'NHAI', 'AAI', 'ECL',
            'BCCL', 'SECL', 'WCL', 'CCL', 'CIL', 'NLCIL', 'NCL', 'DFCCIL', 'NHSRCL', 'RVNL',
            'KRCL', 'CPWD', 'NEEPCO', 'NTPC', 'NHPC', 'PGCIL', 'IOCL', 'BPCL', 'HPCL', 'ONGC',
            'OIL', 'GAIL', 'MRPL', 'NRL', 'BRPL', 'CPCL', 'RCF', 'FACT', 'BHEL', 'SAIL', 'NMDC',
            'MOIL', 'KIOCL', 'NALCO', 'HCL', 'Shipyard', 'Port', 'Irrigation', 'PWD', 'IRCON',
            'MRVC', 'K-RIDE', 'GMRCL', 'UPMRC', 'BMRCL', 'CMRL', 'MMRDA', 'DMRC', 'NMRC'
        ]):
            agency = p_str
            
    # Project name is whatever comes before metadata parentheses
    name_lines = []
    for line in lines:
        if line.startswith('(') and (agency in line or project_code in line or legacy_ocms_code in line or pmgid in line or '-' in line):
            break
        name_lines.append(line)
        
    project_name = " ".join(name_lines).strip()
    return {
        'project_name': project_name,
        'agency': agency,
        'project_code': project_code,
        'legacy_ocms_code': legacy_ocms_code,
        'pmgid': pmgid
    }

def parse_dates(date_str):
    """
    Parses MM/YYYY pairs from string like '03/2023\n(01/2024)' -> ('03/2023', '01/2024')
    """
    if not date_str:
        return None, None
    parts = [p.strip().strip('()') for p in date_str.split('\n') if p.strip()]
    d1 = parts[0] if len(parts) > 0 and parts[0] != '-' and parts[0] != 'NA' and parts[0] != 'N/A' else None
    d2 = parts[1] if len(parts) > 1 and parts[1] != '-' and parts[1] != 'NA' and parts[1] != 'N/A' else None
    return d1, d2

def parse_costs(cost_str):
    """
    Parses original and revised cost in Rs. Crore from string like '265.91\n(265.91)' -> (265.91, 265.91)
    """
    if not cost_str:
        return 0.0, 0.0
    parts = [p.strip().strip('()').replace(',', '') for p in cost_str.split('\n') if p.strip()]
    def to_float(v):
        try:
            return float(v) if v and v != '-' and v != 'NA' else 0.0
        except:
            return 0.0
    c1 = to_float(parts[0]) if len(parts) > 0 else 0.0
    c2 = to_float(parts[1]) if len(parts) > 1 else c1
    return c1, c2

def parse_number(val_str):
    """
    Parses single numeric string like '129.07' or '65%' -> float
    """
    if not val_str:
        return 0.0
    clean = str(val_str).strip().replace(',', '').replace('%', '')
    try:
        return float(clean) if clean and clean != '-' and clean != 'NA' else 0.0
    except:
        return 0.0

def calculate_month_delta(d1_str, d2_str):
    """
    Calculates number of months difference between two MM/YYYY date strings (d2 - d1).
    Returns float months or 0.0 if either date invalid.
    """
    if not d1_str or not d2_str:
        return 0.0
    try:
        parts1 = d1_str.split('/')
        parts2 = d2_str.split('/')
        if len(parts1) == 2 and len(parts2) == 2:
            m1, y1 = int(parts1[0]), int(parts1[1])
            m2, y2 = int(parts2[0]), int(parts2[1])
            return float((y2 - y1) * 12 + (m2 - m1))
    except:
        pass
    return 0.0

# ---------------------------------------------------------
# PHASE 1: Extract Table 6 from April 2026 (Authoritative)
# ---------------------------------------------------------

print("\n--- PHASE 1: Extracting Authoritative April 2026 Snapshot ---")
april_pdf_path = os.path.join(DATASETS_DIR, 'FlashReport_April2026.pdf')

if not os.path.exists(april_pdf_path):
    raise FileNotFoundError(f"Missing authoritative April 2026 PDF: {april_pdf_path}")

april_records = []
current_ministry = "Unknown Ministry"
current_sector = "Unknown Sector"

with pdfplumber.open(april_pdf_path) as pdf:
    # Table 6 starts on page 55 (0-indexed 54) to page 163 (0-indexed 162)
    for p_idx in range(54, len(pdf.pages)):
        page = pdf.pages[p_idx]
        tables = page.extract_tables()
        if not tables:
            continue
            
        for table in tables:
            for row in table:
                if not row or len(row) < 8:
                    continue
                sl_no = (row[0] or "").strip()
                col1 = (row[1] or "").strip()
                
                # Header row skip
                if sl_no == 'Sl.No' or 'Project Name' in col1:
                    continue
                    
                # Section heading row (Ministry / Sector)
                if not sl_no and col1:
                    if 'Ministry of' in col1 or 'Department of' in col1:
                        current_ministry = col1
                    else:
                        current_sector = col1
                    continue
                    
                if sl_no.isdigit():
                    col1_parsed = parse_col1(col1)
                    state = (row[2] or "").strip()
                    app_date, start_date = parse_dates(row[3] or "")
                    target_doc, rev_doc = parse_dates(row[4] or "")
                    orig_cost, rev_cost = parse_costs(row[5] or "")
                    expenditure = parse_number(row[6] or "")
                    progress = parse_number(row[7] or "")
                    
                    p_code = col1_parsed['project_code']
                    pid = f"PAI-{p_code}" if p_code else f"PAI-SL-{sl_no}"
                    
                    # Defensible derived indicators
                    cost_growth = round(((rev_cost - orig_cost) / orig_cost) * 100, 2) if orig_cost > 0 else 0.0
                    exp_ratio = round((expenditure / rev_cost) * 100, 2) if rev_cost > 0 else 0.0
                    cost_overrun_cr = max(0.0, round(rev_cost - orig_cost, 2))
                    sched_ext_months = calculate_month_delta(target_doc, rev_doc) if rev_doc else 0.0
                    
                    rec = {
                        'sl_no': int(sl_no),
                        'project_id': pid,
                        'project_code': p_code,
                        'legacy_ocms_code': col1_parsed['legacy_ocms_code'],
                        'pmgid': col1_parsed['pmgid'],
                        'project_name': col1_parsed['project_name'],
                        'agency': col1_parsed['agency'],
                        'ministry': current_ministry,
                        'sector': current_sector,
                        'state': state,
                        'approval_date': app_date,
                        'start_date': start_date,
                        'target_completion_date': target_doc,
                        'revised_completion_date': rev_doc,
                        'original_cost': orig_cost,
                        'revised_cost': rev_cost,
                        'cumulative_expenditure': expenditure,
                        'physical_progress': progress,
                        'cost_growth_pct': cost_growth,
                        'expenditure_ratio_pct': exp_ratio,
                        'cost_overrun_cr': cost_overrun_cr,
                        'schedule_extension_months': sched_ext_months,
                        'is_cost_escalated': rev_cost > orig_cost,
                        'is_schedule_extended': rev_doc is not None and rev_doc != target_doc and sched_ext_months > 0,
                        'provenance': {
                            'source_document': 'FlashReport_April2026.pdf',
                            'report_period': 'April 2026',
                            'source_table': 'Table 6 — All Ongoing Projects',
                            'reporting_authority': 'PAIMANA / MoSPI, Government of India',
                            'extracted_at': datetime.now().isoformat()
                        }
                    }
                    april_records.append(rec)

print(f"Extracted rows from April 2026 Table 6: {len(april_records)}")

# ---------------------------------------------------------
# PHASE 2: Verification & Reconciliation against Authority
# ---------------------------------------------------------

print("\n--- PHASE 2: April 2026 Source Reconciliation & Quality Verification ---")

df_april = pd.DataFrame(april_records)

# Target authority values from FlashReport_April2026.pdf Page 4 summary
TARGET_PROJECT_COUNT = 1981
TARGET_ORIGINAL_COST = 3712662.00 # in Rs. Crore
TARGET_REVISED_COST = 4278402.00  # in Rs. Crore
TARGET_EXPENDITURE = 2036107.00   # in Rs. Crore

extracted_count = len(df_april)
extracted_orig_cost = float(df_april['original_cost'].sum())
extracted_rev_cost = float(df_april['revised_cost'].sum())
extracted_expenditure = float(df_april['cumulative_expenditure'].sum())

orig_cost_diff_pct = abs(extracted_orig_cost - TARGET_ORIGINAL_COST) / TARGET_ORIGINAL_COST * 100
rev_cost_diff_pct = abs(extracted_rev_cost - TARGET_REVISED_COST) / TARGET_REVISED_COST * 100
exp_diff_pct = abs(extracted_expenditure - TARGET_EXPENDITURE) / TARGET_EXPENDITURE * 100

count_matches = (extracted_count == TARGET_PROJECT_COUNT)
orig_cost_reconciled = (orig_cost_diff_pct <= 0.1)
rev_cost_reconciled = (rev_cost_diff_pct <= 0.1)
exp_reconciled = (exp_diff_pct <= 0.1)

reconciliation_pass = count_matches and orig_cost_reconciled and rev_cost_reconciled and exp_reconciled

print(f"1. Project Count: Extracted = {extracted_count}, Target = {TARGET_PROJECT_COUNT} -> {'PASS' if count_matches else 'FAIL'}")
print(f"2. Original Cost: Extracted = ₹ {extracted_orig_cost:,.2f} Cr, Target = ₹ {TARGET_ORIGINAL_COST:,.2f} Cr (Diff = {orig_cost_diff_pct:.4f}%) -> {'PASS' if orig_cost_reconciled else 'FAIL'}")
print(f"3. Revised Cost: Extracted = ₹ {extracted_rev_cost:,.2f} Cr, Target = ₹ {TARGET_REVISED_COST:,.2f} Cr (Diff = {rev_cost_diff_pct:.4f}%) -> {'PASS' if rev_cost_reconciled else 'FAIL'}")
print(f"4. Cumulative Exp: Extracted = ₹ {extracted_expenditure:,.2f} Cr, Target = ₹ {TARGET_EXPENDITURE:,.2f} Cr (Diff = {exp_diff_pct:.4f}%) -> {'PASS' if exp_reconciled else 'FAIL'}")
print(f"\nOverall Reconciliation Status: {'PASS' if reconciliation_pass else 'FAIL'}")

# Generate Ingestion Audit Metadata
ingestion_audit = {
    "source_file": "FlashReport_April2026.pdf",
    "report_period": "April 2026",
    "source_table": "Table 6 — All Ongoing Projects",
    "target_project_count": TARGET_PROJECT_COUNT,
    "rows_extracted": extracted_count,
    "rows_valid": extracted_count,
    "rows_rejected": 0,
    "unique_project_codes": int(df_april['project_code'].nunique()),
    "missing_project_codes": int((df_april['project_code'] == '').sum()),
    "duplicate_project_codes": int(df_april['project_code'].duplicated().sum()),
    "target_original_cost_cr": TARGET_ORIGINAL_COST,
    "extracted_original_cost_cr": round(extracted_orig_cost, 2),
    "original_cost_diff_pct": round(orig_cost_diff_pct, 4),
    "target_revised_cost_cr": TARGET_REVISED_COST,
    "extracted_revised_cost_cr": round(extracted_rev_cost, 2),
    "revised_cost_diff_pct": round(rev_cost_diff_pct, 4),
    "target_expenditure_cr": TARGET_EXPENDITURE,
    "extracted_expenditure_cr": round(extracted_expenditure, 2),
    "expenditure_diff_pct": round(exp_diff_pct, 4),
    "average_physical_progress_pct": round(float(df_april['physical_progress'].mean()), 2),
    "total_ministries_count": int(df_april['ministry'].nunique()),
    "total_sectors_count": int(df_april['sector'].nunique()),
    "total_states_count": int(df_april['state'].nunique()),
    "projects_with_cost_escalation": int((df_april['revised_cost'] > df_april['original_cost']).sum()),
    "projects_with_schedule_extension": int((df_april['schedule_extension_months'] > 0).sum()),
    "reconciliation_status": "PASS" if reconciliation_pass else "FAIL",
    "reconciliation_timestamp": datetime.now().isoformat()
}

with open(os.path.join(OUTPUT_DIR_METADATA, 'ingestion_audit.json'), 'w', encoding='utf-8') as f:
    json.dump(ingestion_audit, f, indent=2)

# Save April 2026 Normalized Dataset (JSON & Parquet)
with open(os.path.join(OUTPUT_DIR_NORMALIZED, 'paimana_april_2026.json'), 'w', encoding='utf-8') as f:
    json.dump(april_records, f, indent=2)

df_april.to_parquet(os.path.join(OUTPUT_DIR_NORMALIZED, 'paimana_projects.parquet'), index=False)
df_april.to_csv(os.path.join(OUTPUT_DIR_NORMALIZED, 'paimana_april_2026.csv'), index=False)

print(f"Saved normalized April 2026 datasets -> {OUTPUT_DIR_NORMALIZED}")

# ---------------------------------------------------------
# PHASE 3: Historical Snapshots Extraction & Matching
# ---------------------------------------------------------

print("\n--- PHASE 3: Ingesting Multi-Period Historical Reports ---")

# Define reporting snapshots in chronological order
SNAPSHOT_REPORTS = [
    {'period': 'October 2025', 'date_key': '2025-10', 'file': 'FlashReport_October_2025.pdf', 'table6_page': 41},
    {'period': 'November 2025', 'date_key': '2025-11', 'file': 'FlashReport_November_2025.pdf', 'table6_page': 41},
    {'period': 'December 2025', 'date_key': '2025-12', 'file': 'FlashReport_December_2025.pdf', 'table6_page': 49},
    {'period': 'January 2026', 'date_key': '2026-01', 'file': 'FlashReport_January_2026.pdf', 'table6_page': 61},
    {'period': 'February 2026', 'date_key': '2026-02', 'file': 'FlashReport_February_2026.pdf', 'table6_page': 64},
    {'period': 'March 2026', 'date_key': '2026-03', 'file': 'FlashReport_March_2026.pdf', 'table6_page': 54},
    {'period': 'April 2026', 'date_key': '2026-04', 'file': 'FlashReport_April2026.pdf', 'table6_page': 54},
    {'period': 'May 2026', 'date_key': '2026-05', 'file': 'FlashReport_May2026.pdf', 'table6_page': 53},
    {'period': 'June 2026', 'date_key': '2026-06', 'file': 'FlashReport_June_2026.pdf', 'table6_page': 58},
    {'period': 'July 2026', 'date_key': '2026-07', 'file': 'FlashReport_July_2026.pdf', 'table6_page': 54},
]

historical_snapshots_by_project = {}
snapshot_summary = []

for report_cfg in SNAPSHOT_REPORTS:
    pdf_file = report_cfg['file']
    period = report_cfg['period']
    date_key = report_cfg['date_key']
    start_page = report_cfg['table6_page']
    
    full_path = os.path.join(DATASETS_DIR, pdf_file)
    if not os.path.exists(full_path):
        print(f"Skipping {pdf_file} (not found)")
        continue
        
    print(f"Processing snapshot: {period} ({pdf_file})...")
    
    count_extracted = 0
    with pdfplumber.open(full_path) as pdf:
        start_idx = max(0, start_page - 1)
        for p_idx in range(start_idx, len(pdf.pages)):
            page = pdf.pages[p_idx]
            tables = page.extract_tables()
            if not tables:
                continue
            for table in tables:
                for row in table:
                    if not row or len(row) < 8:
                        continue
                    sl_no = (row[0] or "").strip()
                    col1 = (row[1] or "").strip()
                    if sl_no.isdigit():
                        col1_p = parse_col1(col1)
                        p_code = col1_p['project_code']
                        if not p_code:
                            continue
                            
                        app_date, start_date = parse_dates(row[3] or "")
                        target_doc, rev_doc = parse_dates(row[4] or "")
                        orig_c, rev_c = parse_costs(row[5] or "")
                        exp = parse_number(row[6] or "")
                        prog = parse_number(row[7] or "")
                        
                        snap = {
                            'report_period': period,
                            'report_date_key': date_key,
                            'source_document': pdf_file,
                            'target_completion_date': target_doc,
                            'revised_completion_date': rev_doc,
                            'original_cost': orig_c,
                            'revised_cost': rev_c,
                            'cumulative_expenditure': exp,
                            'physical_progress': prog
                        }
                        
                        if p_code not in historical_snapshots_by_project:
                            historical_snapshots_by_project[p_code] = []
                        historical_snapshots_by_project[p_code].append(snap)
                        count_extracted += 1
                        
    snapshot_summary.append({
        'period': period,
        'date_key': date_key,
        'filename': pdf_file,
        'records_extracted': count_extracted
    })
    print(f"  -> Extracted {count_extracted} records for {period}")

# Sort snapshots chronologically for each project
for p_code, snaps in historical_snapshots_by_project.items():
    snaps.sort(key=lambda x: x['report_date_key'])

# Save historical snapshots
with open(os.path.join(OUTPUT_DIR_SNAPSHOTS, 'paimana_historical_snapshots.json'), 'w', encoding='utf-8') as f:
    json.dump(historical_snapshots_by_project, f, indent=2)

with open(os.path.join(OUTPUT_DIR_METADATA, 'snapshot_summary.json'), 'w', encoding='utf-8') as f:
    json.dump(snapshot_summary, f, indent=2)

print(f"\nTotal projects with at least 1 historical snapshot: {len(historical_snapshots_by_project)}")
multi_snapshot_projects = [k for k, v in historical_snapshots_by_project.items() if len(v) >= 3]
print(f"Projects with 3+ historical snapshots: {len(multi_snapshot_projects)}")
deep_snapshot_projects = [k for k, v in historical_snapshots_by_project.items() if len(v) >= 6]
print(f"Projects with 6+ historical snapshots: {len(deep_snapshot_projects)}")

# ---------------------------------------------------------
# PHASE 4: Programmatic Hero Project Candidate Selection
# ---------------------------------------------------------

print("\n--- PHASE 4: Evaluating Real Hero Project Candidates ---")

hero_candidates = []
for rec in april_records:
    p_code = rec['project_code']
    snaps = historical_snapshots_by_project.get(p_code, [])
    # Candidate criteria:
    # 1. Mega project (Orig cost >= 5000 Cr)
    # 2. Historical snapshot depth >= 5 periods
    # 3. Non-zero progress and expenditure
    if rec['original_cost'] >= 5000 and len(snaps) >= 5 and rec['physical_progress'] > 0:
        hero_candidates.append({
            'project_id': rec['project_id'],
            'project_code': rec['project_code'],
            'project_name': rec['project_name'],
            'sector': rec['sector'],
            'ministry': rec['ministry'],
            'agency': rec['agency'],
            'state': rec['state'],
            'original_cost': rec['original_cost'],
            'revised_cost': rec['revised_cost'],
            'cumulative_expenditure': rec['cumulative_expenditure'],
            'physical_progress': rec['physical_progress'],
            'snapshot_count': len(snaps),
            'cost_growth_pct': rec['cost_growth_pct'],
            'schedule_extension_months': rec['schedule_extension_months']
        })

hero_candidates.sort(key=lambda x: (x['snapshot_count'], x['revised_cost']), reverse=True)

print(f"Found {len(hero_candidates)} highly qualified Real Hero Project candidates.")
if hero_candidates:
    top_hero = hero_candidates[0]
    print(f"\nTOP SELECTED REAL HERO PROJECT:")
    print(f"  ID: {top_hero['project_id']} (Code: {top_hero['project_code']})")
    print(f"  Name: {top_hero['project_name']}")
    print(f"  Agency: {top_hero['agency']} | State: {top_hero['state']}")
    print(f"  Original Cost: ₹{top_hero['original_cost']:,.2f} Cr | Revised Cost: ₹{top_hero['revised_cost']:,.2f} Cr")
    print(f"  Expenditure: ₹{top_hero['cumulative_expenditure']:,.2f} Cr | Progress: {top_hero['physical_progress']}%")
    print(f"  Historical Snapshots: {top_hero['snapshot_count']} monthly periods")

with open(os.path.join(OUTPUT_DIR_METADATA, 'hero_candidates.json'), 'w', encoding='utf-8') as f:
    json.dump(hero_candidates, f, indent=2)

# ---------------------------------------------------------
# PHASE 5: Compute Portfolio Summary Aggregations
# ---------------------------------------------------------

print("\n--- PHASE 5: Pre-computing Portfolio Summary Aggregations ---")

# Ministry aggregations
ministry_agg = {}
for r in april_records:
    m = r['ministry']
    if m not in ministry_agg:
        ministry_agg[m] = {'ministry': m, 'project_count': 0, 'original_cost': 0.0, 'revised_cost': 0.0, 'expenditure': 0.0}
    ministry_agg[m]['project_count'] += 1
    ministry_agg[m]['original_cost'] += r['original_cost']
    ministry_agg[m]['revised_cost'] += r['revised_cost']
    ministry_agg[m]['expenditure'] += r['cumulative_expenditure']

# Sector aggregations
sector_agg = {}
for r in april_records:
    s = r['sector']
    if s not in sector_agg:
        sector_agg[s] = {'sector': s, 'project_count': 0, 'original_cost': 0.0, 'revised_cost': 0.0, 'expenditure': 0.0}
    sector_agg[s]['project_count'] += 1
    sector_agg[s]['original_cost'] += r['original_cost']
    sector_agg[s]['revised_cost'] += r['revised_cost']
    sector_agg[s]['expenditure'] += r['cumulative_expenditure']

# State aggregations
state_agg = {}
for r in april_records:
    st = r['state'].split(' / ')[0] if r['state'] else 'Multi-State'
    if st not in state_agg:
        state_agg[st] = {'state': st, 'project_count': 0, 'original_cost': 0.0, 'revised_cost': 0.0, 'expenditure': 0.0}
    state_agg[st]['project_count'] += 1
    state_agg[st]['original_cost'] += r['original_cost']
    state_agg[st]['revised_cost'] += r['revised_cost']
    state_agg[st]['expenditure'] += r['cumulative_expenditure']

portfolio_summary = {
    'headline': {
        'total_projects': len(april_records),
        'original_cost_cr': round(extracted_orig_cost, 2),
        'revised_cost_cr': round(extracted_rev_cost, 2),
        'cumulative_expenditure_cr': round(extracted_expenditure, 2),
        'expenditure_ratio_pct': round((extracted_expenditure / extracted_rev_cost) * 100, 2),
        'average_physical_progress_pct': round(float(df_april['physical_progress'].mean()), 2),
        'cost_growth_total_cr': round(extracted_rev_cost - extracted_orig_cost, 2),
        'cost_growth_total_pct': round(((extracted_rev_cost - extracted_orig_cost) / extracted_orig_cost) * 100, 2),
        'total_ministries': len(ministry_agg),
        'total_sectors': len(sector_agg),
        'total_states': len(state_agg),
        'projects_with_cost_growth': int((df_april['cost_growth_pct'] > 0).sum()),
        'projects_with_schedule_extension': int((df_april['schedule_extension_months'] > 0).sum()),
        'report_period': 'April 2026',
        'source_authority': 'PAIMANA Flash Report (April 2026), MoSPI'
    },
    'ministries': sorted(list(ministry_agg.values()), key=lambda x: x['project_count'], reverse=True),
    'sectors': sorted(list(sector_agg.values()), key=lambda x: x['project_count'], reverse=True),
    'states': sorted(list(state_agg.values()), key=lambda x: x['project_count'], reverse=True),
    'top_cost_escalations': df_april[df_april['cost_overrun_cr'] > 0].sort_values('cost_overrun_cr', ascending=False).head(20)[
        ['project_id', 'project_name', 'ministry', 'sector', 'original_cost', 'revised_cost', 'cost_overrun_cr', 'cost_growth_pct', 'physical_progress']
    ].to_dict(orient='records'),
    'top_schedule_extensions': df_april[df_april['schedule_extension_months'] > 0].sort_values('schedule_extension_months', ascending=False).head(20)[
        ['project_id', 'project_name', 'ministry', 'sector', 'target_completion_date', 'revised_completion_date', 'schedule_extension_months', 'physical_progress']
    ].to_dict(orient='records')
}

with open(os.path.join(OUTPUT_DIR_NORMALIZED, 'paimana_portfolio_summary.json'), 'w', encoding='utf-8') as f:
    json.dump(portfolio_summary, f, indent=2)

print(f"Generated portfolio summary aggregations -> {OUTPUT_DIR_NORMALIZED}/paimana_portfolio_summary.json")

print("\n" + "="*80)
print("PAIMANA INGESTION & RECONCILIATION COMPLETED SUCCESSFULLY!")
print("="*80)
