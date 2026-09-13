#!/usr/bin/env python3
"""
PAIMANA PREDICT: SUITE 21 — 18-ROLE REAL-WORLD WORKSPACE AND RBAC SUITE
Validates the complete 18 canonical roles, multi-assignment capability,
organization directory, resource scoping, workflow guardrails, and audit logging.
"""

import json
import urllib.request
import urllib.error
import sys

BASE_URL = 'http://127.0.0.1:3000'

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def make_req(path, method='GET', data=None, token=None):
    url = f'{BASE_URL}{path}'
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, method=method, headers=headers)
    if data is not None:
        req.data = json.dumps(data).encode('utf-8')
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode('utf-8')
            try:
                return resp.status, json.loads(body) if body else {}
            except Exception:
                return resp.status, {'raw': body}
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body) if body else {}
        except Exception:
            return e.code, {'error': body}

def run_suite_21():
    print('======================================================================')
    print('PAIMANA PREDICT: SUITE 21 — 18-ROLE REAL-WORLD WORKSPACE AND RBAC')
    print('======================================================================')

    # 1. 19 Demo Personas (18 Canonical Single-Role + 1 Multi-Assignment)
    DEMO_USERS = [
        # Group A: Executive and Central Monitoring
        ('secretary', 'secretary123', 'senior_decision_maker', 'CABINET_PMO'),
        ('officer', 'officer123', 'monitoring_officer', 'MOSPI_IPMD'),
        ('ministry', 'ministry123', 'admin_ministry_review', 'MORTH'),

        # Group B: Implementing Agency and Project Execution
        ('nodal', 'nodal123', 'project_admin', 'BBNL'),
        ('engineer', 'engineer123', 'project_engineering', 'CDEB'),
        ('quality', 'quality123', 'quality_auditor', 'EIL_TPI'),
        ('finance', 'finance123', 'project_finance', 'IFD_ACCOUNTS'),
        ('contractor', 'contractor123', 'contractor_rep', 'LT_EPC'),
        ('supervision', 'supervision123', 'supervision_consultant', 'FEEDBACK_PMC'),

        # Group C: Coordination and Higher-Level Review
        ('coordination', 'coordination123', 'inter_ministerial_coordination', 'IMPSC'),
        ('state', 'state123', 'state_coordination', 'STATE_INFRA'),
        ('gatishakti', 'gatishakti123', 'gatishakti_officer', 'GATISHAKTI_NPG'),
        ('appraisal', 'appraisal123', 'investment_appraisal_reviewer', 'PIB_APPRAISAL'),
        ('finreview', 'finreview123', 'financial_review_authority', 'FINMIN_EXP'),
        ('audit', 'audit123', 'audit_observer', 'CAG_AUDIT'),

        # Group D: Predictive and Platform Layer
        ('analyst', 'analyst123', 'risk_analyst', 'NITI_ANALYTICS'),
        ('aigov', 'aigov123', 'ai_governance', 'MEITY_AIGOV'),
        ('sysadmin', 'sysadmin123', 'data_platform_security_admin', 'NIC_PLATFORM'),

        # Multi-Assignment Capability Test User
        ('multirole', 'multi123', 'monitoring_officer', 'MOSPI_IPMD')
    ]

    print('\n[1] Testing Authentication and Token Issuance for all 19 Personas...')
    tokens = {}
    for username, password, expected_role, expected_org_code in DEMO_USERS:
        status, res = make_req('/api/v1/auth/login', method='POST', data={'username': username, 'password': password})
        assert status == 200, f'Login failed for {username}: {status} - {res}'
        assert 'token' in res, f'No token returned for {username}'
        user = res.get('user', {})
        assert user.get('role') == expected_role, f'Role mismatch for {username}: expected {expected_role}, got {user.get("role")}'
        assert len(user.get('assigned_roles', [])) >= 1, f'No assigned_roles for {username}'
        assert expected_role in user.get('assigned_roles', []), f'{expected_role} not in assigned_roles for {username}'
        
        # Verify organization context
        org = user.get('organization', {})
        org_code = org.get('code') if isinstance(org, dict) else org
        assert org_code == expected_org_code, f'Org code mismatch for {username}: expected {expected_org_code}, got {org_code}'
        tokens[username] = (res['token'], user)

    print('  [OK] All 19 Personas authenticated successfully with JWT and Organization Context.')

    # 2. Testing Organization Catalog
    print('\n[2] Testing Organizations Catalog API...')
    sysadmin_token = tokens['sysadmin'][0]
    status, org_res = make_req('/api/v1/auth/organizations', token=sysadmin_token)
    assert status == 200, f'Failed to get organizations: {status}'
    orgs = org_res.get('organizations', [])
    assert len(orgs) >= 18, f'Expected at least 18 organizations, got {len(orgs)}'
    print(f'  [OK] Organizations Catalog verified ({len(orgs)} institutional entities loaded).')

    # 3. Testing Multi-Assignment Workspace Switching
    print('\n[3] Testing Multi-Assignment Workspace Switching...')
    multi_token, multi_user = tokens['multirole']
    assert 'admin_ministry_review' in multi_user.get('assigned_roles', []), 'multirole must have admin_ministry_review in assigned_roles'

    # Valid switch: switch to assigned role
    status, switch_res = make_req('/api/v1/auth/switch-role', method='POST', 
                                  data={'targetRole': 'admin_ministry_review'}, 
                                  token=multi_token)
    assert status == 200, f'Role switch to authorized role failed: {status} - {switch_res}'
    assert switch_res.get('role') == 'admin_ministry_review', 'Role switch response role mismatch'
    new_token = switch_res.get('token') or multi_token
    print('  [OK] Authorized role switch succeeded (monitoring_officer -> admin_ministry_review).')

    # Invalid switch: switch to unassigned role (quality_auditor)
    status, deny_res = make_req('/api/v1/auth/switch-role', method='POST', 
                                data={'targetRole': 'quality_auditor'}, 
                                token=new_token)
    assert status == 403, f'Unauthorized role switch should return 403, got {status}'
    assert deny_res.get('code') == 'FORBIDDEN_ROLE_SWITCH', f'Error code mismatch: {deny_res}'
    print('  [OK] Unauthorized role switch blocked with HTTP 403 (FORBIDDEN_ROLE_SWITCH).')

    # 4. Testing Resource Scoping and Project Isolation
    print('\n[4] Testing Project-Level Tenant / Resource Isolation...')
    nodal_token = tokens['nodal'][0]
    
    # Nodal Officer can update assigned project
    status, ok_res = make_req('/api/v1/projects/PAI-706775/update', method='POST',
                              data={'newProgress': 88.0, 'notes': 'Monthly physical progress increment'},
                              token=nodal_token)
    assert status == 200, f'Project Admin should be able to update assigned project: {status} - {ok_res}'

    # Nodal Officer is blocked from unassigned project
    status, denied_res = make_req('/api/v1/projects/PAI-999999/update', method='POST',
                                  data={'newProgress': 50.0, 'notes': 'Unauthorized update attempt'},
                                  token=nodal_token)
    assert status == 403, f'Project Admin should be blocked from unassigned project: got {status}'
    print('  [OK] Project resource isolation enforced (Nodal Officer blocked from unassigned project PAI-999999).')

    # 5. Testing Workflow State Machine and Anti-Tamper Guardrails
    print('\n[5] Testing Workflow State Machine Guardrails...')
    contractor_token = tokens['contractor'][0]
    # Contractor attempts to close an NCR
    status, ncr_res = make_req('/api/v1/quality/ncrs/NCR-TEST-01', method='PATCH',
                               data={'status': 'CLOSED', 'verificationLab': 'Self-Certified'},
                               token=contractor_token)
    assert status == 403, f'Contractor must not be allowed to CLOSE an NCR: got {status}'
    print('  [OK] Contractor blocked from closing NCR with HTTP 403.')

    # 6. Testing Cross-Role Coordination Routes
    print('\n[6] Testing Inter-Ministerial Coordination RBAC...')
    coord_token = tokens['coordination'][0]
    status, case_res = make_req('/api/v1/coordination/cases', method='POST',
                                data={
                                    'projectId': 'PAI-706775',
                                    'title': 'Cabinet Secretariat High-Speed RoW Clearance',
                                    'leadMinistry': 'MoRTH',
                                    'participatingMinistries': ['MoRTH', 'MoR', 'MoEFCC'],
                                    'severity': 'HIGH'
                                },
                                token=coord_token)
    assert status == 201, f'Inter-ministerial coordination case creation failed: {status}'
    print('  [OK] Inter-Ministerial case created successfully by Cabinet Secretariat Chair.')

    # Contractor cannot create coordination case
    status, deny_coord = make_req('/api/v1/coordination/cases', method='POST',
                                  data={'projectId': 'PAI-706775', 'title': 'Contractor request'},
                                  token=contractor_token)
    assert status == 403, f'Contractor should not create coordination case: got {status}'
    print('  [OK] Unauthorized coordination case creation blocked with HTTP 403.')

    # 7. Testing Executive Directives RBAC
    print('\n[7] Testing Executive Directives RBAC...')
    sec_token = tokens['secretary'][0]
    
    # Retrieve existing briefs or fallback to default seeded brief
    status, briefs_res = make_req('/api/v1/decisions/briefs', token=sec_token)
    briefs = briefs_res.get('data', [])
    brief_id = briefs[0].get('briefId') or briefs[0].get('id') if len(briefs) > 0 else 'DEC-2026-00042'

    status, dir_res = make_req(f'/api/v1/decisions/briefs/{brief_id}/directive', method='POST',
                               data={
                                   'selectedOptionId': 'OPT_B',
                                   'justification': 'Cabinet Directive on Right-of-Way Expedited Settlement across Maharashtra corridor',
                                   'directiveNoticeRef': 'CAB-SEC/DIR/2026/042',
                                   'immediateActions': ['Complete joint survey within 14 calendar days']
                               },
                               token=sec_token)
    assert status in (200, 201), f'Executive Directive creation failed: {status} - {dir_res}'
    print('  [OK] Executive Directive created successfully by Senior Decision Maker.')

    # Monitoring officer cannot issue directives
    officer_token = tokens['officer'][0]
    status, deny_dir = make_req(f'/api/v1/decisions/briefs/{brief_id}/directive', method='POST',
                                data={
                                    'selectedOptionId': 'OPT_B',
                                    'justification': 'Unauthorized directive attempt'
                                },
                                token=officer_token)
    assert status == 403, f'Monitoring Officer must be blocked from issuing directives: got {status}'
    print('  [OK] Monitoring Officer blocked from issuing Executive Directives with HTTP 403.')

    # 8. Testing Audit Trail Immutability and Coverage
    print('\n[8] Testing Audit Trail Event Coverage...')
    status, audit_res = make_req('/api/v1/audit', token=sysadmin_token)
    assert status == 200, f'Failed to retrieve audit logs: {status}'
    logs = audit_res.get('logs', [])
    logged_actions = {l.get('action') for l in logs}

    assert 'ROLE_SWITCH' in logged_actions, 'ROLE_SWITCH not logged in audit trail'
    assert 'ROLE_SWITCH_DENIED' in logged_actions, 'ROLE_SWITCH_DENIED not logged in audit trail'
    assert 'PERMISSION_DENIED' in logged_actions, 'PERMISSION_DENIED not logged in audit trail'
    print(f'  [OK] Audit Trail validated ({len(logs)} events): ROLE_SWITCH, ROLE_SWITCH_DENIED, PERMISSION_DENIED recorded.')

    print('\n======================================================================')
    print('ALL SUITE 21 TESTS COMPLETED AND PASSED (100% SUCCESS)!')
    print('======================================================================')

if __name__ == '__main__':
    run_suite_21()
