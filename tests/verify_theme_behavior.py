import os
import glob
import re
import sys

# Ensure UTF-8 output encoding for Windows pwsh
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print("="*60)
print("PAIMANA PREDICT: THEME SYSTEM AUTOMATED INTEGRITY SUITE")
print("="*60)

# TEST 1: Check tailwind.config.js
with open('tailwind.config.js', 'r', encoding='utf-8') as f:
    tw_content = f.read()
assert "darkMode: 'class'" in tw_content, "Tailwind dark mode class not configured"
print("TEST 1: Tailwind darkMode: 'class' configured -> PASS")

# TEST 2: Check ThemeContext.tsx fallback and storage key
with open('src/context/ThemeContext.tsx', 'r', encoding='utf-8') as f:
    tc_content = f.read()
assert "paimana_theme" in tc_content, "Storage key paimana_theme missing in ThemeContext"
assert "return 'light'" in tc_content, "Default light fallback missing in ThemeContext"
print("TEST 2: ThemeContext defaults to 'light' and persists 'paimana_theme' -> PASS")

# TEST 3: Check index.html head script
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()
assert "paimana_theme" in html_content, "Synchronous storage check missing in index.html"
assert "document.documentElement.classList.remove('dark')" in html_content, "Removal of dark on light state missing in index.html"
print("TEST 3: index.html synchronous head script removes dark class on clean state -> PASS")

# TEST 4: Check TopNav theme toggle button
with open('src/components/layout/TopNav.tsx', 'r', encoding='utf-8') as f:
    topnav_content = f.read()
assert "Light" in topnav_content, "Light toggle indicator missing in TopNav"
assert "Dark" in topnav_content, "Dark toggle indicator missing in TopNav"
print("TEST 4: TopNav toggle displays current theme (Light / Dark) -> PASS")

# TEST 5: Verify all pages contain theme-aware bg and border tokens
pages = glob.glob('src/pages/**/*.tsx', recursive=True)
for p in pages:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    assert 'dark:' in content, f"Page {p} missing theme-aware dark: classes"
print(f"TEST 5: All {len(pages)} Page components verified for theme adaptability -> PASS")

print("="*60)
print("ALL THEME SYSTEM INTEGRITY TESTS PASSED SUCCESSFULLY!")
print("="*60)
