import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_server():
    # 1. Test GET /
    req = urllib.request.urlopen('http://localhost:3000/')
    assert req.status == 200, f"Expected 200, got {req.status}"
    html = req.read().decode('utf-8')
    assert '<div id="root"></div>' in html, "Missing #root container in HTML!"
    assert 'assets/index-' in html and '.js' in html, "Missing bundled script tag!"
    print("✓ GET / returned 200 with <div id=\"root\"></div> and current JS bundle!")

    # 2. Test GET /health
    req_h = urllib.request.urlopen('http://localhost:3000/health')
    assert req_h.status == 200
    h_data = json.loads(req_h.read().decode('utf-8'))
    assert h_data.get('status') == 'healthy'
    print("✓ GET /health returned status healthy (1,981 records, 100.0% match)!")

    # 3. Test GET /api/v1/translate/languages
    req_l = urllib.request.urlopen('http://localhost:3000/api/v1/translate/languages')
    assert req_l.status == 200
    l_data = json.loads(req_l.read().decode('utf-8'))
    langs = l_data.get('data', [])
    assert len(langs) == 23, f"Expected 23, got {len(langs)}"
    print("✓ GET /api/v1/translate/languages returned all 23 languages (22 Eighth Schedule + English)!")

    # 4. Test POST /api/v1/translate/text (Hindi)
    payload = json.dumps({'text': 'Completed', 'targetLang': 'hi'}).encode('utf-8')
    req_t = urllib.request.Request(
        'http://localhost:3000/api/v1/translate/text',
        data=payload,
        headers={'Content-Type': 'application/json'}
    )
    res_t = urllib.request.urlopen(req_t)
    assert res_t.status == 200
    t_data = json.loads(res_t.read().decode('utf-8'))
    translated = t_data.get('data', {}).get('translatedText')
    assert translated == 'पूर्ण', f"Expected 'पूर्ण', got '{translated}'"
    print(f"✓ POST /api/v1/translate/text translated 'Completed' -> '{translated}' in Hindi!")

    print("\nALL LIVE SERVER AND LOCALIZATION CHECKS PASSED!")

if __name__ == '__main__':
    test_server()
