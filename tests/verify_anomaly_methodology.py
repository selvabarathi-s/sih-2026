#!/usr/bin/env python3
"""
PAIMANA PREDICT: ISOLATION FOREST & UNSUPERVISED ANOMALY METHODOLOGY SUITE
Verifies that Isolation Forest is strictly reported with unsupervised metrics and no supervised pseudo-metrics.
Smart India Hackathon 2026 • Problem Statement 26103
"""

import os
import sys
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def run_tests():
    print("=" * 75)
    print("PAIMANA PREDICT: ANOMALY METHODOLOGY & INTEGRITY SUITE")
    print("=" * 75)

    model_path = os.path.join("ml", "artifacts", "anomaly", "isolation_forest_model.json")
    assert os.path.exists(model_path), "isolation_forest_model.json missing"

    with open(model_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Assert NO supervised pseudo-metrics are present
    assert "roc_auc" not in data, "Methodological Violation: Supervised ROC-AUC found on unsupervised Isolation Forest!"
    assert "precision" not in data, "Methodological Violation: Supervised Precision found on unsupervised Isolation Forest!"
    assert "recall" not in data, "Methodological Violation: Supervised Recall found on unsupervised Isolation Forest!"
    assert "f1_score" not in data, "Methodological Violation: Supervised F1 found on unsupervised Isolation Forest!"
    print("TEST 1: Scientific Integrity Audit: Supervised metrics strictly excluded from Isolation Forest -> PASS")

    # 2. Assert Valid Unsupervised Metrics ARE present
    assert "contamination_rate" in data, "Contamination rate missing"
    assert "percentage_flagged_pct" in data, "Percentage flagged missing"
    assert "anomaly_score_distribution" in data, "Anomaly score distribution missing"
    assert "downstream_deterioration_overlap_pct" in data, "Downstream overlap missing"

    print(f"TEST 2: Unsupervised Metrics Verified (Contamination: {data['contamination_rate']}, Flagged: {data['percentage_flagged_pct']}%, Overlap: {data['downstream_deterioration_overlap_pct']}%) -> PASS")

    # 3. Assert Scientific Integrity Note
    assert "scientific_integrity_note" in data, "Scientific integrity note missing"
    print("TEST 3: Scientific Integrity Note Verified -> PASS")

    print("=" * 75)
    print("ALL ANOMALY METHODOLOGY & INTEGRITY TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
