import os
import glob
import fitz # PyMuPDF
import json
import re

pdf_files = sorted(glob.glob('datasets/*.pdf'))

print(f"Total PDF files in datasets: {len(pdf_files)}")
print("="*80)

summary = []

for pdf_path in pdf_files:
    fname = os.path.basename(pdf_path)
    try:
        doc = fitz.open(pdf_path)
        page_count = len(doc)
        
        # Look for titles or headings in first 5 pages
        first_pages_text = ""
        for i in range(min(5, page_count)):
            first_pages_text += f"\n--- Page {i+1} ---\n" + doc[i].get_text()[:600]
            
        # Search for "TABLE 6" or "Table 6" or "All Ongoing Projects" or "Ongoing Projects"
        table6_pages = []
        for i in range(page_count):
            text = doc[i].get_text()
            if "Table 6" in text or "TABLE 6" in text or "All Ongoing Projects" in text or "List of Ongoing Projects" in text:
                table6_pages.append(i + 1)
                
        summary.append({
            'file': fname,
            'pages': page_count,
            'table6_pages_count': len(table6_pages),
            'table6_first_page': table6_pages[0] if table6_pages else None,
            'table6_last_page': table6_pages[-1] if table6_pages else None,
            'snippet': first_pages_text[:300].replace('\n', ' ')
        })
        doc.close()
    except Exception as e:
        summary.append({'file': fname, 'error': str(e)})

for s in summary:
    print(f"File: {s['file']}")
    if 'error' in s:
        print(f"  Error: {s['error']}")
    else:
        print(f"  Pages: {s['pages']}, Table 6 Pages: {s['table6_pages_count']} (First: {s['table6_first_page']}, Last: {s['table6_last_page']})")
    print("-" * 60)
