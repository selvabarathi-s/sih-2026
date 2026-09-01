import sys
import os
import re
import pdfplumber
import json

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'datasets/FlashReport_April2026.pdf'

projects = []
current_ministry = "Unknown"
current_sector = "Unknown"

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    # Table 6 starts around page 55 (index 54) to end (page 163, index 162)
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
                
                # Check if header row
                if sl_no == 'Sl.No' or 'Project Name' in col1:
                    continue
                    
                # Check if Ministry or Sector header row
                if not sl_no and col1:
                    # Check if it starts with Ministry or is a sector name
                    if 'Ministry of' in col1 or 'Department of' in col1:
                        current_ministry = col1
                    else:
                        current_sector = col1
                    continue
                    
                # If sl_no is a number, it's a project!
                if sl_no.isdigit():
                    state = (row[2] or "").strip()
                    dates_approval = (row[3] or "").strip()
                    dates_doc = (row[4] or "").strip()
                    costs = (row[5] or "").strip()
                    expenditure = (row[6] or "").strip()
                    progress = (row[7] or "").strip()
                    
                    projects.append({
                        'sl_no': int(sl_no),
                        'raw_col1': col1,
                        'ministry': current_ministry,
                        'sector': current_sector,
                        'state': state,
                        'dates_approval_start': dates_approval,
                        'dates_doc': dates_doc,
                        'costs': costs,
                        'expenditure': expenditure,
                        'progress': progress,
                        'page': p_idx + 1
                    })

print(f"\nTotal extracted project rows: {len(projects)}")
if projects:
    print(f"First project (Sl.No {projects[0]['sl_no']}): {projects[0]}")
    print(f"Last project (Sl.No {projects[-1]['sl_no']}): {projects[-1]}")
