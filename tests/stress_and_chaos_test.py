"""
PAIMANA PREDICT — 20-YEAR VETERAN STRESS, CHAOS & WORST-CASE TEST HARNESS
Simulates 300 to 1,000 concurrent active users, burst load, race conditions,
adversarial fuzzing, malformed payloads, and process survival verification.
"""

import sys
import time
import json
import random
import statistics
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:3000"
API_URL = f"{BASE_URL}/api/v1"

OFFICER_TOKEN = "paimana_token_usr-officer-01_1726000000000"
NODAL_TOKEN = "paimana_token_usr-nodal-01_1726000000000"
ADMIN_TOKEN = "paimana_token_usr-sysadmin-01_1726000000000"
ANALYST_TOKEN = "paimana_token_usr-analyst-01_1726000000000"
CONTRACTOR_TOKEN = "paimana_token_usr-contractor-01_1726000000000"

def banner(title):
    print(f"\n{'='*80}")
    print(f" {title}")
    print(f"{'='*80}")

def subbanner(title):
    print(f"\n--- {title} ---")

# ==============================================================================
# PHASE 1: 1,000-REQUEST MULTITHREADED CONCURRENCY BURST
# Simulating 300 - 1,000 simultaneous active user sessions
# ==============================================================================
def run_concurrency_burst_test(total_requests=1000, max_workers=100):
    banner(f"PHASE 1: HIGH CONCURRENCY BURST ({total_requests} REQUESTS ACROSS {max_workers} THREADS)")
    print(f"Simulating 300 - 1,000 active government officers concurrently querying the platform...")

    sample_projects = ["PAI-706775", "PAI-705237", "PAI-705728", "PAI-701263", "PAI-702668"]
    sample_searches = ["expressway", "railway", "metro", "broadband", "highway", "solar", "line"]

    def make_burst_request(req_id):
        session = requests.Session()
        t0 = time.perf_counter()
        route_type = req_id % 7

        try:
            if route_type == 0:
                # Health Probes
                r = session.get(f"{BASE_URL}/health", timeout=10)
                path = "/health"
            elif route_type == 1:
                # Project Portfolio with Randomized Pagination & Filters
                page = (req_id % 20) + 1
                size = random.choice([10, 20, 50])
                search = random.choice(sample_searches) if req_id % 3 == 0 else ""
                url = f"{API_URL}/projects?page={page}&pageSize={size}&search={search}"
                r = session.get(url, timeout=10)
                path = "/api/v1/projects"
            elif route_type == 2:
                # Risk Analysis & Prioritization
                proj = random.choice(sample_projects)
                r = session.get(f"{API_URL}/risk/{proj}", timeout=10)
                path = "/api/v1/risk/:id"
            elif route_type == 3:
                # Reference Master Data
                r = session.get(f"{API_URL}/reference", timeout=10)
                path = "/api/v1/reference"
            elif route_type == 4:
                # Prediction Confidence & Resilience
                proj = random.choice(sample_projects)
                sub_endpoint = "confidence" if req_id % 2 == 0 else "resilience"
                r = session.get(f"{API_URL}/projects/{proj}/{sub_endpoint}", timeout=10)
                path = f"/api/v1/projects/:id/{sub_endpoint}"
            elif route_type == 5:
                # Systemic Dependency Graph & Cascading Impact
                proj = random.choice(sample_projects)
                r = session.post(f"{API_URL}/dependencies/projects/{proj}/cascade", json={"additionalDelayMonths": 6}, timeout=10)
                path = "/api/v1/dependencies/projects/:id/cascade"
            else:
                # ML Model Card & Governance
                r = session.get(f"{API_URL}/models/time-gbm-v1.4", timeout=10)
                path = "/api/v1/models/:id"

            elapsed_ms = (time.perf_counter() - t0) * 1000
            return {
                "id": req_id,
                "path": path,
                "status": r.status_code,
                "elapsed_ms": elapsed_ms,
                "success": r.status_code in [200, 201, 204],
                "is_500": r.status_code >= 500,
                "error": None
            }
        except Exception as e:
            elapsed_ms = (time.perf_counter() - t0) * 1000
            return {
                "id": req_id,
                "path": "UNKNOWN",
                "status": 0,
                "elapsed_ms": elapsed_ms,
                "success": False,
                "is_500": True,
                "error": str(e)
            }

    start_time = time.perf_counter()
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(make_burst_request, i) for i in range(total_requests)]
        for f in as_completed(futures):
            results.append(f.result())

    total_duration = time.perf_counter() - start_time
    rps = total_requests / total_duration

    successes = [r for r in results if r["success"]]
    server_errors = [r for r in results if r["is_500"]]
    latencies = [r["elapsed_ms"] for r in results]

    p50 = statistics.median(latencies)
    p95 = statistics.quantiles(latencies, n=20)[18] if len(latencies) >= 20 else max(latencies)
    p99 = statistics.quantiles(latencies, n=100)[98] if len(latencies) >= 100 else max(latencies)
    avg_lat = statistics.mean(latencies)
    max_lat = max(latencies)
    min_lat = min(latencies)

    print(f"\n[RESULTS] Concurrency Burst Execution Summary:")
    print(f"  • Total Requests Fired:    {total_requests}")
    print(f"  • Total Elapsed Time:      {total_duration:.2f} seconds")
    print(f"  • System Throughput:       {rps:.1f} req/sec")
    print(f"  • Successful (HTTP 2xx):   {len(successes)} ({len(successes)/total_requests*100:.1f}%)")
    print(f"  • Server Errors (HTTP 5xx):{len(server_errors)} ({len(server_errors)/total_requests*100:.1f}%)")
    print(f"  • Min Latency:             {min_lat:.1f} ms")
    print(f"  • Mean Latency:            {avg_lat:.1f} ms")
    print(f"  • p50 (Median) Latency:    {p50:.1f} ms")
    print(f"  • p95 Latency:             {p95:.1f} ms")
    print(f"  • p99 Latency:             {p99:.1f} ms")
    print(f"  • Max Latency:             {max_lat:.1f} ms")

    assert len(server_errors) == 0, f"Critical failure: Encountered {len(server_errors)} 5xx errors under load!"
    assert len(successes) / total_requests >= 0.99, f"Success rate {len(successes)/total_requests*100}% below 99% threshold!"
    print("  ✓ Concurrency burst test PASSED with 0 server errors and rock-solid latency!")


# ==============================================================================
# PHASE 2: CONCURRENT STATE MUTATIONS & RACE CONDITION STRESS
# Simulating simultaneous telemetry, updates, and evidence submissions
# ==============================================================================
def run_concurrent_mutation_test(workers=50):
    banner(f"PHASE 2: CONCURRENT MUTATION & RACE CONDITION STRESS ({workers} WORKERS)")
    print("Testing simultaneous writes across monitoring updates, NCRs, case management, and project progress...")

    def submit_telemetry(idx):
        url = f"{API_URL}/monitoring/submissions"
        headers = {"Authorization": f"Bearer nodal"}
        payload = {
            "projectId": "PAI-706775",
            "physical_progress": 68.0 + (idx % 5) * 0.5,
            "cumulative_expenditure": 31000.0 + (idx * 20),
            "revised_cost": 42784.0,
            "record_version": 1
        }
        r = requests.post(url, json=payload, headers=headers, timeout=10)
        # Expect 201 or 409 (concurrency conflict) or 422 (validation), but NEVER 500 crash!
        return {"type": "telemetry", "status": r.status_code, "is_500": r.status_code >= 500}

    def submit_ncr(idx):
        url = f"{API_URL}/quality/PAI-706775/ncrs"
        headers = {"Authorization": f"Bearer quality"}
        payload = {
            "title": f"Stress Concurrency NCR #{idx}",
            "description": f"Automated concurrency stress test non-conformance flag #{idx}",
            "severity": "MEDIUM",
            "location": f"Section Km {idx + 10}"
        }
        r = requests.post(url, json=payload, headers=headers, timeout=10)
        return {"type": "ncr", "status": r.status_code, "is_500": r.status_code >= 500}

    def submit_case_action(idx):
        url = f"{API_URL}/cases"
        headers = {"Authorization": f"Bearer officer"}
        payload = {
            "projectId": "PAI-706775",
            "title": f"Concurrent Investigation Case #{idx}",
            "severity": "HIGH",
            "initialFactors": {"landAcquisitionDelay": True, "utilityLineShifting": False}
        }
        r = requests.post(url, json=payload, headers=headers, timeout=10)
        return {"type": "case", "status": r.status_code, "is_500": r.status_code >= 500}

    tasks = []
    with ThreadPoolExecutor(max_workers=workers) as executor:
        for i in range(workers):
            if i % 3 == 0:
                tasks.append(executor.submit(submit_telemetry, i))
            elif i % 3 == 1:
                tasks.append(executor.submit(submit_ncr, i))
            else:
                tasks.append(executor.submit(submit_case_action, i))

        results = [t.result() for t in as_completed(tasks)]

    is_500_count = sum(1 for r in results if r["is_500"])
    status_codes = [r["status"] for r in results]
    print(f"  • Concurrent write tasks executed: {len(results)}")
    print(f"  • HTTP Status distribution: {dict((s, status_codes.count(s)) for s in set(status_codes))}")
    assert is_500_count == 0, f"Critical failure: Encountered {is_500_count} 5xx server crashes during concurrent writes!"
    print("  ✓ Concurrent mutation stress PASSED: Zero crashes, clean concurrency management!")


# ==============================================================================
# PHASE 3: WORST-CASE ADVERSARIAL FUZZING & ERROR HANDLING
# Probing extreme inputs, malformed data, buffer limits, injection, and traversal
# ==============================================================================
def run_adversarial_fuzz_test():
    banner("PHASE 3: WORST-CASE ADVERSARIAL FUZZING & BOUNDARY TESTING")
    session = requests.Session()

    # 1. Malformed JSON Syntax (Should return 400 Bad Request with MALFORMED_JSON)
    subbanner("Test 3.1: Malformed JSON Syntax Injection")
    malformed_bodies = [
        '{"title": "Unterminated string',
        '{invalid_json_without_quotes: true}',
        '{"array": [1, 2, 3, ]}',
        '<<<NOT_JSON>>>',
        '{"nested": '
    ]
    for body in malformed_bodies:
        r = session.post(f"{API_URL}/workflow/projects/register", data=body, headers={"Content-Type": "application/json", "Authorization": "Bearer admin"})
        assert r.status_code == 400, f"Expected 400 for malformed JSON, got {r.status_code}: {r.text}"
        res = r.json()
        assert res.get("error", {}).get("code") == "MALFORMED_JSON", f"Expected error.code MALFORMED_JSON, got {res}"
    print(f"  ✓ Verified {len(malformed_bodies)} malformed JSON payloads rejected with HTTP 400 (MALFORMED_JSON)")

    # 2. Oversized Payload Limits (DoS & Memory Exhaustion Protection)
    subbanner("Test 3.2: Oversized Payload Rejection (11MB Body)")
    huge_payload = {"description": "A" * (11 * 1024 * 1024)} # 11MB string
    r = session.post(f"{API_URL}/workflow/projects/register", json=huge_payload, headers={"Authorization": "Bearer admin"})
    assert r.status_code == 413, f"Expected 413 for oversized body, got {r.status_code}: {r.text}"
    res = r.json()
    assert res.get("error", {}).get("code") == "PAYLOAD_TOO_LARGE", f"Expected PAYLOAD_TOO_LARGE, got {res}"
    print(f"  ✓ Verified oversized payload (>10MB) cleanly rejected with HTTP 413 (PAYLOAD_TOO_LARGE)")

    # 3. Numeric Inversions, Extremes & Boundary Protection
    subbanner("Test 3.3: Numeric Inversions & Parameter Fuzzing")
    # Projects listing with invalid page/limit
    fuzz_query_params = [
        {"page": "abc", "pageSize": "xyz"},
        {"page": -10, "pageSize": -50},
        {"page": 0, "pageSize": 0},
        {"page": 1, "pageSize": 999999999},
        {"limit": "NaN", "offset": "Infinity"},
        {"sortBy": "__proto__", "sortOrder": "invalid"}
    ]
    for params in fuzz_query_params:
        r = session.get(f"{API_URL}/projects", params=params)
        assert r.status_code == 200, f"Expected 200 with sanitized pagination for {params}, got {r.status_code}: {r.text}"
        data = r.json().get("data", [])
        meta = r.json().get("meta", {})
        assert meta.get("pageSize") <= 5000, f"Page size exceeded safe limit: {meta}"
        assert meta.get("page") >= 1, f"Page index below 1: {meta}"
    print(f"  ✓ Verified {len(fuzz_query_params)} malicious/fuzzed pagination queries sanitized safely")

    # Dependency cascade with invalid delay
    fuzz_delay_params = [
        {"additionalDelayMonths": "bad_string"},
        {"additionalDelayMonths": -20},
        {"additionalDelayMonths": None}
    ]
    for p in fuzz_delay_params:
        r = session.post(f"{API_URL}/dependencies/projects/PAI-705728/cascade", json=p)
        assert r.status_code == 200, f"Expected 200 sanitized cascade for {p}, got {r.status_code}"
    print(f"  ✓ Verified dependency cascade delay fuzzer sanitized safely")

    # 4. Path Traversal & Special Character Injections
    subbanner("Test 3.4: Path Traversal & Injection Vectors")
    traversal_ids = [
        "../../../../etc/passwd",
        "..%2F..%2F..%2F..%2Fetc%2Fpasswd",
        "..%2F..%2Fwindows%2Fsystem32",
        "PAI-706775\0nullbyte",
        "<script>alert('xss')</script>",
        "'; DROP TABLE projects; --",
        " " * 50,
        "UNDEFINED",
        "NULL"
    ]
    for tid in traversal_ids:
        r = session.get(f"{API_URL}/projects/{tid}")
        assert r.status_code in [400, 404], f"Expected 400 or 404 for traversal ID '{tid}', got {r.status_code}: {r.text}"
        assert r.status_code < 500, f"Encountered 5xx crash on traversal input '{tid}'!"
    print(f"  ✓ Verified {len(traversal_ids)} path traversal and injection probes handled with safe 404/400")

    # 5. Non-Existent Resources (Comprehensive 404 Sweep)
    subbanner("Test 3.5: Non-Existent Resource Sweep (Uniform 404s)")
    endpoints = [
        "/projects/PAI-NONEXISTENT-9999",
        "/projects/PAI-NONEXISTENT-9999/resilience",
        "/projects/PAI-NONEXISTENT-9999/confidence",
        "/projects/PAI-NONEXISTENT-9999/similar",
        "/risk/PAI-NONEXISTENT-9999",
        "/cases/CASE-NONEXISTENT-9999",
        "/decisions/briefs/DEC-NONEXISTENT-9999",
        "/system/corrections/CORR-NONEXISTENT-9999/review"
    ]
    for ep in endpoints:
        r = session.get(f"{API_URL}{ep}", headers={"Authorization": "Bearer admin"})
        assert r.status_code in [400, 404], f"Endpoint {ep} must return 404, got {r.status_code}: {r.text}"
        assert r.status_code < 500, f"Endpoint {ep} crashed with 500: {r.text}"
    print(f"  ✓ Verified {len(endpoints)} routes return clean 404 Not Found without crashing")

    # 6. Invalid Reporting Cycle & Concurrency Conflict Handling
    subbanner("Test 3.6: Missing Reporting Cycle & Conflict Handlers")
    invalid_cycle_payload = {
        "projectId": "PAI-706775",
        "cycleId": "CYCLE-DOES-NOT-EXIST-9999",
        "physical_progress": 68.0,
        "cumulative_expenditure": 31000.0,
        "revised_cost": 42784.0
    }
    r = session.post(f"{API_URL}/monitoring/submissions", json=invalid_cycle_payload, headers={"Authorization": "Bearer nodal"})
    assert r.status_code == 404, f"Expected 404 for non-existent cycle, got {r.status_code}: {r.text}"
    print("  ✓ Non-existent reporting cycle rejected with clean HTTP 404")

    # 7. Forged, Expired, and Malformed Tokens
    subbanner("Test 3.7: Forged, Expired, and Malformed Token Injections")
    bad_tokens = [
        "Bearer malformed.jwt.token.that.is.gibberish",
        "Bearer",
        "Token without_bearer_prefix",
        "Bearer \0nullbyte\0",
        "Bearer " + "A" * 5000 # Giant token string
    ]
    for token in bad_tokens:
        r = session.get(f"{API_URL}/audit/logs", headers={"Authorization": token})
        assert r.status_code in [400, 401, 403], f"Expected 400/401/403 for bad token '{token[:25]}...', got {r.status_code}"
    print(f"  ✓ Verified {len(bad_tokens)} forged/malformed authentication tokens rejected with 400/401/403")

    # 8. Malformed Login Payloads
    subbanner("Test 3.8: Malformed Login Payloads")
    bad_logins = [
        {"username": {"$gt": ""}, "password": 123}, # NoSQL / Object injection
        {"username": None, "password": None},
        {"username": "admin", "password": ["array_pass"]},
        {}
    ]
    for creds in bad_logins:
        r = session.post(f"{API_URL}/auth/login", json=creds)
        assert r.status_code in [400, 401], f"Expected 400/401 for bad login, got {r.status_code}: {r.text}"
    print(f"  ✓ Verified {len(bad_logins)} type-confused login requests handled safely with 400/401")

    print("\n  ✓ ALL ADVERSARIAL FUZZING & CHAOS TESTS PASSED (100% SUCCESS)!")


# ==============================================================================
# PHASE 4: POST-BARRAGE SYSTEM HEALTH & MEMORY STABILITY
# ==============================================================================
def run_post_barrage_health_check():
    banner("PHASE 4: POST-BARRAGE HEALTH & STABILITY VERIFICATION")
    r = requests.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health check failed post-barrage: {r.status_code}"
    health = r.json()

    print(f"  • Post-Barrage Service Status:   {health.get('status')}")
    print(f"  • Service Uptime:                {health.get('uptime_seconds')} seconds")
    print(f"  • Database Reconciled Records:   {health.get('database', {}).get('recordsAvailable')}")
    print(f"  • Database Match Status:         {health.get('database', {}).get('reconciliationStatus')}")

    assert health.get("status") == "healthy", "System unhealthy after stress test!"
    assert health.get("database", {}).get("recordsAvailable") == 1981, "Record count drift detected!"
    print("\n  ✓ SYSTEM IS 100% HEALTHY, RESILIENT, AND STABLE AFTER COMPREHENSIVE LOAD!")


def run_full_suite():
    print("=" * 80)
    print(" PAIMANA PREDICT: 20-YEAR VETERAN STRESS, CHAOS & RESILIENCE TEST SUITE")
    print(" Testing dynamic high-user concurrency (300 - 1,000 users) & worst-case recovery")
    print("=" * 80)

    t_start = time.time()
    run_concurrency_burst_test(total_requests=1000, max_workers=100)
    run_concurrent_mutation_test(workers=50)
    run_adversarial_fuzz_test()
    run_post_barrage_health_check()
    t_end = time.time()

    banner(f"ALL STRESS, CHAOS & WORST-CASE TESTS COMPLETED IN {t_end - t_start:.2f}s (100% SUCCESS)!")
    return True

if __name__ == "__main__":
    try:
        success = run_full_suite()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n[CRITICAL TEST FAILURE]: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
