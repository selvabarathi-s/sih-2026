import os
import glob
import re
import fitz
import json

pdf_files = sorted(glob.glob('datasets/*.pdf'))

reports_info = []

for pdf_path in pdf_files:
    fname = os.path.basename(pdf_path)
    doc = fitz.open(pdf_path)
    page_count = len(doc)
    
    # Extract report title & period from first 3 pages
    text_sample = ""
    for i in range(min(4, page_count)):
        text_sample += "\n" + doc[i].get_text()
        
    # Match Month Year (e.g. APRIL 2026, MAY 2025, etc.)
    month_match = re.search(r'(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s*(202\d)', text_sample, re.IGNORECASE)
    period = f"{month_match.group(1).title()} {month_match.group(2)}" if month_match else fname
    
    # Match ongoing projects count from overview if present
    count_match = re.search(r'(\d{3,4})\s*\|\s*(\d{1,2})\s*\nOngoing Projects', text_sample)
    if not count_match:
        count_match = re.search(r'(\d{3,4})\s*\nOngoing Projects', text_sample)
        
    reported_count = count_match.group(1) if count_match else "Unknown"
    
    # Check if Table 6 exists and find start page
    table6_page = None
    for i in range(page_count):
        t = doc[i].get_text()
        if "Table 6: All Ongoing Projects" in t or "Table 6 : All Ongoing Projects" in t or ("Table 6" in t and "All Ongoing Projects" in t):
            if i > 1: # past TOC
                table6_page = i + 1
                break
                
    reports_info.append({
        'filename': fname,
        'period': period,
        'pages': page_count,
        'reported_ongoing_count': reported_count,
        'table6_start_page': table6_page
    })
    doc.close()

print(json.dumps(reports_info, indent=2))
