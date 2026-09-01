import sys
import fitz
import pdfplumber

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'datasets/FlashReport_April2026.pdf'
doc = fitz.open(pdf_path)

print("=== TABLE 6 DETAILED INSPECTION (PAGES 54 TO 58) ===")
for p_num in range(53, 58):
    print(f"\n==================== PAGE {p_num + 1} ====================")
    text = doc[p_num].get_text()
    print("--- RAW TEXT ---")
    print(text[:3000])

doc.close()

with pdfplumber.open(pdf_path) as pdf:
    for p_num in range(53, 58):
        page = pdf.pages[p_num]
        tables = page.extract_tables()
        print(f"\n==================== [pdfplumber] PAGE {p_num + 1} ====================")
        print(f"Extracted {len(tables)} tables")
        if tables:
            for t_idx, t in enumerate(tables):
                print(f"Table {t_idx+1} rows: {len(t)}, cols: {len(t[0]) if t else 0}")
                for r_idx in range(min(5, len(t))):
                    print(f"  Row {r_idx}: {t[r_idx]}")
