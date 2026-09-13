#!/usr/bin/env python3
"""
PAIMANA PREDICT: PROBABILITY CALIBRATION & THRESHOLD GOVERNANCE VERIFICATION SUITE
Verifies Brier score, class balance, and decision threshold governance.
Smart India Hackathon 2026 • Problem Statement 26103
"""

import os
import sys
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def run_tests():
    print("=" * 75)
    print("PAIMANA PREDICT: PROBABILITY CALIBRATION & THRESHOLD GOVERNANCE SUITE")
    print("=" * 75)

    card_path = os.path.join("ml", "artifacts", "cards", "time_gbm_v1.4_card.json")
    assert os.path.exists(card_path), "time_gbm_v1.4_card.json missing"

    with open(card_path, "r", encoding="utf-8") as f:
        card = json.load(f)

    # 1. Verify Brier Score
    metrics = card.get("classification_metrics", {})
    brier = metrics.get("brier_score")
    assert brier is not None, "Brier score missing"
    assert brier < 0.20, f"Brier score too high (poor calibration): {brier}"
    print(f"TEST 1: Model Calibration Brier Score Verified (Brier = {brier:.4f} < 0.20) -> PASS")

    # 2. Verify Decision Threshold Governance
    threshold = card.get("decision_threshold")
    assert threshold is not None, "Decision threshold missing"
    assert 0.40 <= threshold <= 0.50, f"Decision threshold out of governed bounds: {threshold}"
    print(f"TEST 2: Governed Decision Threshold Verified (Threshold = {threshold} for early-warning sensitivity) -> PASS")

    # 3. Verify Class Balance
    pos_rate = metrics.get("positive_class_rate_pct")
    assert pos_rate is not None, "Positive class rate missing"
    assert 40.0 <= pos_rate <= 70.0, f"Positive rate unexpected: {pos_rate}%"
    print(f"TEST 3: Target Class Balance Verified (Positive Event Rate: {pos_rate}%) -> PASS")

    print("=" * 75)
    print("ALL PROBABILITY CALIBRATION & THRESHOLD TESTS PASSED (100% SUCCESS)!")
    print("=" * 75)

if __name__ == "__main__":
    run_tests()
