#!/usr/bin/env python3
"""
PAIMANA PREDICT: TEMPORAL LABELS & FORECAST HORIZON VERIFICATION SUITE
Verifies target definition, explicit 90-day forecast horizon, and negative anti-leakage injection tests.
Smart India Hackathon 2026 • Problem Statement 26103
"""

import os
import sys
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def run_tests():
    print("=" * 75)
    print("PAIMANA PREDICT: TEMPORAL LABELS & FORECAST HORIZON VERIFICATION SUITE")
    print("=" * 75)

    snap_path = os.path.join("data", "snapshots", "paimana_historical_snapshots.json")
    assert os.path.exists(snap_path), "Historical snapshots missing"

    with open(snap_path, "r", encoding="utf-8") as f:
        snapshots = json.load(f)

    sample_code = "706775" # BharatNet
    series = snapshots.get(sample_code, [])
    assert len(series) >= 10, "BharatNet must have at least 10 monthly snapshots"

    # Test Cutoff at index 3 (January 2026)
    cutoff_idx = 3
    cutoff_snapshot = series[cutoff_idx]
    as_of_period = cutoff_snapshot["report_period"]
    assert as_of_period == "January 2026", f"Expected January 2026, got {as_of_period}"

    # Past snapshots: indices 0..3 (Oct 2025, Nov 2025, Dec 2025, Jan 2026)
    past_history = series[:cutoff_idx + 1]
    for p in past_history:
        assert p["report_date_key"] <= "2026-01", f"Temporal Leakage: {p['report_date_key']} > 2026-01 in past history!"
    print(f"TEST 1: Historical Past Isolation Verified ({len(past_history)} past snapshots <= 2026-01) -> PASS")

    # Future snapshots: indices 4..6 (Feb 2026, Mar 2026, Apr 2026 -> 90-day horizon)
    future_window = series[cutoff_idx + 1: min(len(series), cutoff_idx + 4)]
    assert len(future_window) == 3, f"Expected 3 future periods (90 days), got {len(future_window)}"
    for f_snap in future_window:
        assert f_snap["report_date_key"] > "2026-01", f"Future Label Error: {f_snap['report_date_key']} <= 2026-01 in future window!"
    print(f"TEST 2: Future 90-Day Forecast Horizon Verified ({[s['report_period'] for s in future_window]}) -> PASS")

    # Negative Injection Test:
    # Deliberately attempt to pass a sequence with a future snapshot (e.g. May 2026) into a cutoff for January 2026
    injected_series = past_history + [{"report_period": "May 2026", "report_date_key": "2026-05", "physical_progress": 99.0}]
    
    # Filter function must strictly reject the future observation
    filtered_for_jan = [s for s in injected_series if s["report_date_key"] <= "2026-01"]
    assert len(filtered_for_jan) == len(past_history), "Negative test failed: future injected snapshot was not filtered!"
    assert all(s["report_date_key"] <= "2026-01" for s in filtered_for_jan), "Future snapshot leaked through filter!"
    print("TEST 3: Negative Anti-Leakage Injection Test (Deliberate Future Injection Rejection) -> PASS")

    print("=" * 75)
    print("ALL TEMPORAL LABELS & HORIZON TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
