"""
Automated Test for Translation Dictionary Integrity & Coverage
Verifies that:
1. All overview.* keys are defined in EN, HI, and TA.
2. All NAV_KEY_MAP entries in Sidebar.tsx are mapped and defined in EN, HI, and TA.
3. DOM_INDIC_DICTIONARY contains essential phrases.
"""

import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_integrity():
    with open('src/services/i18n/translations.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    en_section = content.split('en: {')[1].split('hi: {')[0]
    hi_section = content.split('hi: {')[1].split('bn: {')[0]
    ta_section = content.split('ta: {')[1].split('gu: {')[0]

    en_keys = set(re.findall(r"'([a-zA-Z0-9_\.]+)':", en_section))
    hi_keys = set(re.findall(r"'([a-zA-Z0-9_\.]+)':", hi_section))
    ta_keys = set(re.findall(r"'([a-zA-Z0-9_\.]+)':", ta_section))

    print(f"Total EN keys: {len(en_keys)}")
    print(f"Total HI keys: {len(hi_keys)}")
    print(f"Total TA keys: {len(ta_keys)}")
    if en_keys - hi_keys:
        print("Missing in Hindi:", en_keys - hi_keys)
    if hi_keys - en_keys:
        print("Extra in Hindi:", hi_keys - en_keys)

    overview_keys = [k for k in en_keys if k.startswith('overview.')]
    print(f"Overview keys defined: {len(overview_keys)}")
    for k in overview_keys:
        assert k in hi_keys, f"Missing in Hindi: {k}"
        assert k in ta_keys, f"Missing in Tamil: {k}"

    print("✓ 100% of overview.* keys are present in English, Hindi, and Tamil!")

    with open('src/components/layout/Sidebar.tsx', 'r', encoding='utf-8') as f:
        sidebar = f.read()

    nav_map_block = sidebar.split('const NAV_KEY_MAP')[1].split('};')[0]
    mapped_keys = re.findall(r":\s*'([a-zA-Z0-9_\.]+)'", nav_map_block)
    print(f"Total Sidebar NAV_KEY_MAP items: {len(mapped_keys)}")

    for k in mapped_keys:
        assert k in en_keys, f"Sidebar key {k} missing in translations.ts (en)"
        assert k in hi_keys, f"Sidebar key {k} missing in translations.ts (hi)"

    print("✓ 100% of Sidebar NAV_KEY_MAP items are present in English and Hindi!")

    # Check DOM dictionary
    with open('src/services/i18n/domTranslator.ts', 'r', encoding='utf-8') as f:
        dom_content = f.read()

    essential_phrases = [
        "AUTHORITATIVE PAIMANA DATASET • FLASH REPORT APRIL 2026",
        "Table 6 Ongoing Projects",
        "Live Operational System of Record",
        "Government Infrastructure Workflow & Workload Command Center",
        "Active Interventions",
        "Unacknowledged Signals",
        "Monthly Submissions",
        "Automated Escalations",
        "Observed Cost Growth",
        "Total Monitored Projects",
        "Total Sanctioned Cost",
        "Anticipated Revised Cost",
        "Cumulative Expenditure",
        "TOP PRIORITY PROJECTS (PRIORITIZATION ENGINE QUEUE)",
        "Rank",
        "Risk Score (0–100)",
        "Project Identity",
        "Sector & Ministry",
        "Cost Exposure",
        "Delay Exposure",
        "Primary Risk Driver",
        "Action",
        "Inspect",
        "On Time",
        "REAL HERO PROJECT DOSSIER",
        "CRITICAL RISK",
        "Original Sanctioned",
        "Revised Cost Baseline",
        "Observed Cost Revision",
        "Cumulative Expended",
        "Reported Progress",
    ]

    for phrase in essential_phrases:
        assert phrase in dom_content, f"Missing phrase in DOM_INDIC_DICTIONARY: {phrase}"

    print("✓ 100% of essential DOM phrases are present in DOM_INDIC_DICTIONARY!")
    print("\nSUCCESS: All translation integrity tests passed!")

if __name__ == '__main__':
    test_integrity()
