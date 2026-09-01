import sys
import os
import re
import pdfplumber
import json
import pandas as pd

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'datasets/FlashReport_April2026.pdf'

def parse_col1(col1_text):
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
        
    # 3. PMGID (e.g. (4353), (5163), (11856), (9931))
    # Look for last line parentheses containing numbers
    all_paren = re.findall(r'\(([^)]+)\)', col1_text)
    for p in all_paren:
        p_str = p.strip()
        if p_str.isdigit() and p_str != project_code:
            pmgid = p_str
        elif any(kw in p_str for kw in ['Authority', 'Limited', 'Ltd', 'Corporation', 'Railways', 'NHAI', 'AAI', 'ECL', 'BCCL', 'SECL', 'WCL', 'CCL', 'CIL', 'NLCIL', 'NCL', 'DFCCIL', 'NHSRCL', 'RVNL', 'KRCL', 'CPWD', 'NEEPCO', 'NTPC', 'NHPC', 'PGCIL', 'IOCL', 'BPCL', 'HPCL', 'ONGC', 'OIL', 'GAIL', 'MRPL', 'NRL', 'BRPL', 'CPCL', 'RCF', 'FACT', 'BHEL', 'SAIL', 'NMDC', 'MOIL', 'KIOCL', 'NALCO', 'HCL', 'Shipyard', 'Port', 'Irrigation', 'PWD']):
            agency = p_str
            
    # Project name is whatever is before metadata parentheses
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
    # e.g. "03/2023\n(01/2024)" -> ("03/2023", "01/2024")
    # or "01/2026\n(-)" -> ("01/2026", None)
    parts = [p.strip().strip('()') for p in date_str.split('\n') if p.strip()]
    d1 = parts[0] if len(parts) > 0 and parts[0] != '-' else None
    d2 = parts[1] if len(parts) > 1 and parts[1] != '-' else None
    return d1, d2

def parse_costs(cost_str):
    # e.g. "265.91\n(265.91)" -> (265.91, 265.91)
    parts = [p.strip().strip('()').replace(',', '') for p in cost_str.split('\n') if p.strip()]
    def to_float(v):
        try:
            return float(v) if v and v != '-' else 0.0
        except:
            return 0.0
    c1 = to_float(parts[0]) if len(parts) > 0 else 0.0
    c2 = to_float(parts[1]) if len(parts) > 1 else c1
    return c1, c2

def parse_number(val_str):
    if not val_str:
        return 0.0
    clean = val_str.strip().replace(',', '').replace('%', '')
    try:
        return float(clean) if clean and clean != '-' else 0.0
    except:
        return 0.0

records = []
current_ministry = "Unknown Ministry"
current_sector = "Unknown Sector"

with pdfplumber.open(pdf_path) as pdf:
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
                
                if sl_no == 'Sl.No' or 'Project Name' in col1:
                    continue
                    
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
                    
                    # Generate stable project_id
                    p_code = col1_parsed['project_code']
                    pid = f"PAI-{p_code}" if p_code else f"PAI-SL-{sl_no}"
                    
                    records.append({
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
                        'cost_growth': round(((rev_cost - orig_cost) / orig_cost) * 100, 2) if orig_cost > 0 else 0.0,
                        'expenditure_ratio': round((expenditure / rev_cost) * 100, 2) if rev_cost > 0 else 0.0
                    })

df = pd.DataFrame(records)
print("=== APRIL 2026 EXTRACTION AUDIT & RECONCILIATION ===")
print(f"Total Extracted Projects: {len(df)}")
print(f"Unique Project Codes: {df['project_code'].nunique()} (Missing/Empty Code: {(df['project_code'] == '').sum()})")
print(f"Total Original Cost: ₹ {df['original_cost'].sum():,.2f} Cr")
print(f"Total Revised Cost: ₹ {df['revised_cost'].sum():,.2f} Cr")
print(f"Total Cumulative Expenditure: ₹ {df['cumulative_expenditure'].sum():,.2f} Cr")
print(f"Average Physical Progress: {df['physical_progress'].mean():.2f}%")
print(f"Unique Ministries: {df['ministry'].nunique()}")
print(f"Unique Sectors: {df['sector'].nunique()}")
print(f"Unique States: {df['state'].nunique()}")
