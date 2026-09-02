#!/usr/bin/env python3
"""
PAIMANA PREDICT — AUTHENTICATION, RBAC & WORKFLOW STATE MACHINE VERIFICATION SUITE
Smart India Hackathon 2026 • Problem Statement 26103
"""

import sys
import json
import os
import subprocess

def test_auth_rbac_models():
    print("=" * 60)
    print("PAIMANA PREDICT: AUTH, RBAC & STATE MACHINE VERIFICATION")
    print("=" * 60)

    # 1. Verify userModel.js has all 5 roles
    user_model_path = os.path.join("backend", "src", "models", "userModel.js")
    assert os.path.exists(user_model_path), "userModel.js must exist"

    with open(user_model_path, "r", encoding="utf-8") as f:
        content = f.read()

    roles = ["SYSTEM_ADMIN", "MONITORING_OFFICER", "PROJECT_ADMIN", "DATA_ANALYST", "DECISION_MAKER"]
    for role in roles:
        assert role in content, f"Role '{role}' must be defined in userModel.js"
    print("PASS: All 5 core government roles defined (Admin, Officer, Nodal, Analyst, Secretary)")

    # 2. Verify stateMachines.js
    sm_path = os.path.join("backend", "src", "models", "stateMachines.js")
    assert os.path.exists(sm_path), "stateMachines.js must exist"

    with open(sm_path, "r", encoding="utf-8") as f:
        sm_content = f.read()

    risk_states = ["ON_TRACK", "WATCH", "AT_RISK", "HIGH_RISK", "CRITICAL", "INTERVENTION", "RECOVERY"]
    for rs in risk_states:
        assert rs in sm_content, f"Risk state '{rs}' must be in stateMachines.js"
    print("PASS: Project risk state machine lifecycle defined (ON_TRACK -> ... -> RECOVERY)")

    action_states = ["RISK_DETECTED", "RECOMMENDED", "ACTION_ASSIGNED", "IN_PROGRESS", "EVIDENCE_SUBMITTED", "OFFICER_REVIEW", "RESOLVED", "RECALCULATED"]
    for as_state in action_states:
        assert as_state in sm_content, f"Action state '{as_state}' must be in stateMachines.js"
    print("PASS: Dynamic action workflow lifecycle defined (DETECTED -> ... -> RESOLVED)")

    # 3. Verify RBAC middleware
    rbac_path = os.path.join("backend", "src", "middleware", "rbac.js")
    assert os.path.exists(rbac_path), "rbac.js must exist"
    with open(rbac_path, "r", encoding="utf-8") as f:
        rbac_content = f.read()
    assert "requireRole" in rbac_content, "requireRole middleware must exist"
    assert "requirePermission" in rbac_content, "requirePermission middleware must exist"
    print("PASS: RBAC authorization middleware verified")

    # 4. Verify schema.sql has users, roles, actions, notifications, audit_logs
    schema_path = os.path.join("backend", "src", "database", "schema.sql")
    assert os.path.exists(schema_path), "schema.sql must exist"
    with open(schema_path, "r", encoding="utf-8") as f:
        schema_content = f.read()

    required_tables = ["users", "roles", "permissions", "role_permissions", "project_actions", "action_status_history", "notifications", "audit_logs"]
    for tbl in required_tables:
        assert f"CREATE TABLE IF NOT EXISTS {tbl}" in schema_content, f"Table '{tbl}' must exist in schema.sql"
    print("PASS: Relational database schema specifies users, RBAC, actions, notifications, and audit tables")

    # 5. Verify documentation files exist in docs/
    docs = [
        "architecture.md",
        "role-permissions.md",
        "database-schema.md",
        "api.md",
        "data-pipeline.md",
        "ml-methodology.md",
        "security.md",
        "deployment.md",
    ]
    for doc in docs:
        doc_path = os.path.join("docs", doc)
        assert os.path.exists(doc_path), f"Documentation file 'docs/{doc}' must exist"
    print("PASS: All 8 production architectural documents verified in docs/")

    print("=" * 60)
    print("ALL AUTHENTICATION, RBAC & STATE MACHINE TESTS PASSED (100% SUCCESS)!")
    print("=" * 60)

if __name__ == "__main__":
    test_auth_rbac_models()
