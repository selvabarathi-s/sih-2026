import sys
import os
import re
import pdfplumber
import json
import pandas as pd

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Let's test extraction on 3 monthly snapshots: Dec 2025, Feb 2026, April 2026
snapshots_to_test = [
    ('Dec 2025', 'datasets/FlashReport_December_2025.pdf', 48),
    ('Feb 2026', 'datasets/FlashReport_February_2026.pdf', 63),
    ('Apr 2026', 'datasets/FlashReport_April2026.pdf', 54)
]

def extract_project_codes(pdf_path, start_page_idx):
    codes = set()
    proj_map = {}
    with pdfplumber.open(pdf_path) as pdf:
        for p_idx in range(start_page_idx, len(pdf.pages)):
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
                        code_matches = re.findall(r'\((\d{6})\)', col1)
                        if code_matches:
                            c = code_matches[0]
                            codes.add(c)
                            prog = (row[7] or "").strip().replace('%', '')
                            costs = (row[5] or "").strip()
                            exp = (row[6] or "").strip()
                            proj_map[c] = {
                                'progress': prog,
                                'costs': costs,
                                'expenditure': exp
                            }
    return codes, proj_map

print("Extracting test snapshots...")
dec_codes, dec_map = extract_project_codes(snapshots_to_test[0][1], snapshots_to_test[0][2])
feb_codes, feb_map = extract_project_codes(snapshots_to_test[1][1], snapshots_to_test[1][2])
apr_codes, apr_map = extract_project_codes(snapshots_to_test[2][1], snapshots_to_test[2][2])

print(f"Dec 2025 Unique Codes: {len(dec_codes)}")
print(f"Feb 2026 Unique Codes: {len(feb_codes)}")
print(f"Apr 2026 Unique Codes: {len(apr_codes)}")

# Overlap analysis
overlap_all_three = dec_codes.intersection(feb_codes).intersection(apr_codes)
print(f"Projects tracked continuously across all 3 periods: {len(overlap_all_three)}")

# Check sample project trajectory
sample_code = list(overlap_all_three)[0]
print(f"\nSample Tracked Project Code: {sample_code}")
print(f"  Dec 2025: Progress = {dec_map.get(sample_code, {}).get('progress')}%, Exp = ₹{dec_map.get(sample_code, {}).get('expenditure')} Cr")
print(f"  Feb 2026: Progress = {feb_map.get(sample_code, {}).get('progress')}%, Exp = ₹{feb_map.get(sample_code, {}).get('expenditure')} Cr")
print(f"  Apr 2026: Progress = {apr_map.get(sample_code, {}).get('progress')}%, Exp = ₹{apr_map.get(sample_code, {}).get('expenditure')} Cr")
