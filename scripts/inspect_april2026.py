import sys
import os
import fitz
import pdfplumber

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'datasets/FlashReport_April2026.pdf'
doc = fitz.open(pdf_path)

print("=== APRIL 2026 FLASH REPORT: PAGES 3 TO 10 TEXT ===")
for i in range(2, min(10, len(doc))):
    print(f"\n--- PAGE {i+1} ---")
    print(doc[i].get_text()[:2000])

print("\n=== FINDING START OF TABLE 6 ===")
table6_start_page = None
for i in range(len(doc)):
    text = doc[i].get_text()
    if "Table 6" in text or "TABLE 6" in text or "Table 6: All Ongoing Projects" in text:
        print(f"Table 6 mentioned on Page {i+1}")
        if "Table 6: All Ongoing Projects" in text or "Table 6 : All Ongoing Projects" in text:
            if table6_start_page is None and i > 10: # Past TOC
                table6_start_page = i + 1

print(f"\nTable 6 Start Page: {table6_start_page}")

if table6_start_page:
    print(f"\n--- CONTENT OF TABLE 6 START (PAGE {table6_start_page}) ---")
    print(doc[table6_start_page - 1].get_text()[:2500])

doc.close()
