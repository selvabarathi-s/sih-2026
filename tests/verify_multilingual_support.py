"""
PAIMANA PREDICT — Multilingual & Indic Language Support Verification Suite
Verifies English (default) + all 22 Official Indian Languages (Eighth Schedule of the Constitution of India).
Focus: Hindi (राजभाषा - Rajbhasha) & 22 Constitutional Languages.
"""

import sys
import json
import requests

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:3000"
API_URL = f"{BASE_URL}/api/v1"

# All 22 Official Languages recognized in the Eighth Schedule to the Constitution of India + English
EXPECTED_LANG_CODES = {
    'en',   # English (Default / Union Official)
    'hi',   # Hindi (Union Official / Rajbhasha)
    'as',   # Assamese
    'bn',   # Bengali
    'brx',  # Bodo
    'doi',  # Dogri
    'gu',   # Gujarati
    'kn',   # Kannada
    'ks',   # Kashmiri
    'kok',  # Konkani
    'mai',  # Maithili
    'ml',   # Malayalam
    'mni',  # Manipuri (Meitei)
    'mr',   # Marathi
    'ne',   # Nepali
    'or',   # Odia
    'pa',   # Punjabi
    'sa',   # Sanskrit
    'sat',  # Santali
    'sd',   # Sindhi
    'ta',   # Tamil
    'te',   # Telugu
    'ur',   # Urdu
}

def banner(msg):
    print(f"\n{'='*75}\n {msg}\n{'='*75}")

def test_language_catalog():
    print("\n[TEST 1] Verifying Language Catalog (/api/v1/translate/languages)...")
    r = requests.get(f"{API_URL}/translate/languages")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    body = r.json()
    languages = body.get("data", [])
    meta = body.get("meta", {})

    print(f"  • Total Languages Reported: {len(languages)}")
    assert len(languages) == 23, f"Expected 23 languages (English + 22 Scheduled), got {len(languages)}"

    found_codes = {l["code"] for l in languages}
    missing = EXPECTED_LANG_CODES - found_codes
    assert not missing, f"Missing expected Eighth Schedule languages: {missing}"

    # Verify English Default & Hindi Rajbhasha
    en_meta = next(l for l in languages if l["code"] == "en")
    assert en_meta["isUnionOfficial"] is True
    assert en_meta["name"] == "English"

    hi_meta = next(l for l in languages if l["code"] == "hi")
    assert hi_meta["isUnionOfficial"] is True
    assert hi_meta["nativeName"] == "हिन्दी"
    assert hi_meta["script"] == "Devanagari"
    assert hi_meta["isRajbhasha"] is True

    print("  ✓ All 22 Eighth Schedule Indian Languages + English catalog verified!")
    print(f"  ✓ English Default: {en_meta['name']} (Script: {en_meta['script']})")
    print(f"  ✓ Hindi Rajbhasha: {hi_meta['nativeName']} (Script: {hi_meta['script']})")

def test_hindi_translation():
    print("\n[TEST 2] Verifying Primary Hindi (राजभाषा) Translation Endpoints...")
    test_cases = [
        ("Completed", "पूर्ण"),
        ("In Progress", "प्रगति पर"),
        ("Delayed", "विलंबित"),
        ("Critical", "अति-गंभीर"),
        ("CRITICAL", "अति-गंभीर जोखिम"),
        ("HIGH", "उच्च जोखिम"),
        ("Road Transport and Highways", "सड़क परिवहन एवं राजमार्ग"),
        ("Railways", "रेलवे"),
    ]

    for en_text, expected_hi in test_cases:
        r = requests.post(f"{API_URL}/translate", json={"text": en_text, "targetLang": "hi"})
        assert r.status_code == 200, f"Expected 200 for {en_text}, got {r.status_code}"
        translated = r.json()["data"]["translatedText"]
        assert translated == expected_hi, f"Expected '{expected_hi}', got '{translated}' for '{en_text}'"
        print(f"  ✓ Translated: '{en_text}' -> '{translated}'")

def test_multilingual_indic_translations():
    print("\n[TEST 3] Verifying Multi-Regional Eighth Schedule Translations...")
    test_cases = [
        ("Completed", "bn", "সম্পন্ন"),
        ("Completed", "te", "పూర్తయింది"),
        ("Completed", "ta", "முடிந்தது"),
        ("Completed", "mr", "पूर्ण"),
        ("Railways", "bn", "রেলওয়ে"),
        ("Railways", "te", "రైల్వేలు"),
        ("Railways", "mr", "रेल्वे"),
    ]

    for en_text, lang_code, expected in test_cases:
        r = requests.post(f"{API_URL}/translate", json={"text": en_text, "targetLang": lang_code})
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        translated = r.json()["data"]["translatedText"]
        assert translated == expected, f"Expected '{expected}', got '{translated}' for {lang_code}"
        print(f"  ✓ Translated [{lang_code}]: '{en_text}' -> '{translated}'")

def test_project_payload_localization():
    print("\n[TEST 4] Verifying Project Metadata Localization...")
    sample_project = {
        "project_id": "PAI-706775",
        "name": "BharatNet Phase-II (Maharashtra)",
        "sector_name": "Telecommunications",
        "status": "In Progress",
        "risk_level": "CRITICAL"
    }

    r = requests.post(f"{API_URL}/translate/project", json={"project": sample_project, "targetLang": "hi"})
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    loc = r.json()["data"]
    assert loc["sector_name_translated"] == "दूरसंचार"
    assert loc["status_translated"] == "प्रगति पर"
    assert loc["risk_level_translated"] == "अति-गंभीर जोखिम"
    print("  ✓ Project metadata localized into Hindi:")
    print(f"    • Sector: {sample_project['sector_name']} -> {loc['sector_name_translated']}")
    print(f"    • Status: {sample_project['status']} -> {loc['status_translated']}")
    print(f"    • Risk:   {sample_project['risk_level']} -> {loc['risk_level_translated']}")

def test_boundary_error_handling():
    print("\n[TEST 5] Verifying Translation Error Handling & Worst-Case Inputs...")
    # Unsupported language
    r1 = requests.post(f"{API_URL}/translate", json={"text": "Test", "targetLang": "unsupported_xyz"})
    assert r1.status_code == 400
    assert r1.json()["error"]["code"] == "UNSUPPORTED_LANGUAGE"
    print("  ✓ Unsupported language rejected with HTTP 400 (UNSUPPORTED_LANGUAGE)")

    # Malformed text
    r2 = requests.post(f"{API_URL}/translate", json={"text": None, "targetLang": "hi"})
    assert r2.status_code == 400
    assert r2.json()["error"]["code"] == "INVALID_INPUT"
    print("  ✓ Non-string payload rejected with HTTP 400 (INVALID_INPUT)")

    # Malformed project
    r3 = requests.post(f"{API_URL}/translate/project", json={"project": "not_an_object", "targetLang": "hi"})
    assert r3.status_code == 400
    assert r3.json()["error"]["code"] == "INVALID_INPUT"
    print("  ✓ Non-object project payload rejected with HTTP 400 (INVALID_INPUT)")

def run_suite():
    banner("PAIMANA PREDICT: MULTILINGUAL & INDIC TRANSLATION SUITE")
    test_language_catalog()
    test_hindi_translation()
    test_multilingual_indic_translations()
    test_project_payload_localization()
    test_boundary_error_handling()
    banner("ALL MULTILINGUAL & INDIC LOCALIZATION TESTS PASSED (100% SUCCESS)!")

if __name__ == "__main__":
    run_suite()
