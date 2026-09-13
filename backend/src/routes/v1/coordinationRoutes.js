import express from 'express';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';
import { auditService, AUDIT_EVENT_TYPES } from '../../services/auditService.js';

const router = express.Router();

let COORDINATION_CASES = [
  {
    id: 'COORD-2026-001',
    projectId: 'PAI-706775',
    projectName: 'BharatNet Phase II OFC Laying',
    title: 'Rail-Road RoW Crossing Dispute at Sonpur Junction',
    leadMinistry: 'Ministry of Communications',
    participatingMinistries: ['Ministry of Railways', 'Ministry of Road Transport and Highways'],
    state: 'Bihar',
    bottleneckType: 'RIGHT_OF_WAY',
    severity: 'HIGH',
    status: 'ACTIVE_ESCALATION',
    assignedOfficer: 'Tanvi Saxena (IMPSC)',
    actionItems: [
      { id: 'ACT-C-01', agency: 'East Central Railway', task: 'Joint site survey with BBNL optical team', deadline: '2026-09-25', status: 'IN_PROGRESS' },
      { id: 'ACT-C-02', agency: 'Bihar PWD', task: 'Road cutting permission issuance', deadline: '2026-09-30', status: 'PENDING' },
    ],
    lastMeetingMinutes: 'Inter-ministerial meeting on 02-Sept-2026 agreed on shared trenching under GatiShakti principles.',
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'COORD-2026-002',
    projectId: 'PAI-706776',
    projectName: 'Delhi-Mumbai Expressway Package 14',
    title: 'Gas Pipeline Relocation Clearance at Vadodara Bypass',
    leadMinistry: 'Ministry of Road Transport and Highways',
    participatingMinistries: ['Ministry of Petroleum and Natural Gas', 'Govt of Gujarat'],
    state: 'Gujarat',
    bottleneckType: 'UTILITY_SHIFTING',
    severity: 'CRITICAL',
    status: 'UNDER_REVIEW',
    assignedOfficer: 'Tanvi Saxena (IMPSC)',
    actionItems: [
      { id: 'ACT-C-03', agency: 'GAIL India', task: 'Review pipeline realignment drawings', deadline: '2026-09-20', status: 'IN_PROGRESS' },
    ],
    lastMeetingMinutes: 'Directives issued to expedite statutory safety clearance by GAIL zonal head.',
    createdAt: '2026-08-15T14:30:00Z',
  }
];

let STATE_CLEARANCES = [
  {
    id: 'STATE-CLR-01',
    projectId: 'PAI-706775',
    projectName: 'BharatNet Optical Network',
    state: 'Maharashtra',
    district: 'Nagpur & Wardha',
    clearanceType: 'FOREST_AND_TREE_TRANSIT',
    authority: 'Maharashtra State Forest Department',
    stage: 'STAGE_2_INSPECTION',
    slaDeadline: '2026-10-15',
    status: 'IN_PROGRESS',
    landAreaHa: 14.5,
    pendingAction: 'Site inspection report upload by Divisional Forest Officer',
  },
  {
    id: 'STATE-CLR-02',
    projectId: 'PAI-706775',
    projectName: 'BharatNet Optical Network',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    clearanceType: 'UTILITY_POWER_LINE_SHIFTING',
    authority: 'UP Power Transmission Corporation (UPPTCL)',
    stage: 'ESTIMATE_APPROVED',
    slaDeadline: '2026-09-28',
    status: 'DEMAND_NOTE_ISSUED',
    landAreaHa: 0,
    pendingAction: 'Remittance of shifting charges by BBNL accounts',
  }
];

// GET /api/v1/coordination/cases
router.get('/cases', authenticate, requireAuth, (req, res) => {
  res.status(200).json({
    count: COORDINATION_CASES.length,
    cases: COORDINATION_CASES,
  });
});

// POST /api/v1/coordination/cases
router.post('/cases', authenticate, requireAuth, requireRole('inter_ministerial_coordination', 'admin_ministry_review', 'senior_decision_maker', 'data_platform_security_admin', 'system_admin'), async (req, res) => {
  const { projectId, projectName, title, leadMinistry, participatingMinistries, state, bottleneckType, severity } = req.body;
  if (!title || !projectId) {
    return res.status(400).json({ error: 'Title and projectId are required' });
  }

  const newCase = {
    id: `COORD-${Date.now()}`,
    projectId,
    projectName: projectName || 'Infrastructure Project',
    title,
    leadMinistry: leadMinistry || 'Line Ministry',
    participatingMinistries: participatingMinistries || [],
    state: state || 'Central',
    bottleneckType: bottleneckType || 'INTER_AGENCY',
    severity: severity || 'MEDIUM',
    status: 'ACTIVE_ESCALATION',
    assignedOfficer: req.user.fullName || req.user.username,
    actionItems: [],
    createdAt: new Date().toISOString(),
  };

  COORDINATION_CASES.unshift(newCase);

  await auditService.logEvent({
    action: AUDIT_EVENT_TYPES.COORDINATION_CASE_CREATED,
    actor: req.user.username,
    userId: req.user.userId || req.user.id,
    role: req.user.role,
    organization: req.user.organization,
    resource: newCase.id,
    resourceType: 'COORDINATION_CASE',
    actionResult: 'SUCCESS',
    details: { caseId: newCase.id, projectId, title },
  });

  res.status(201).json({ case: newCase });
});

// GET /api/v1/coordination/state-clearances
router.get('/state-clearances', authenticate, requireAuth, (req, res) => {
  res.status(200).json({
    count: STATE_CLEARANCES.length,
    clearances: STATE_CLEARANCES,
  });
});

// PATCH /api/v1/coordination/state-clearances/:id
router.patch('/state-clearances/:id', authenticate, requireAuth, requireRole('state_coordination', 'admin_ministry_review', 'project_admin', 'data_platform_security_admin', 'system_admin'), (req, res) => {
  const { id } = req.params;
  const clearance = STATE_CLEARANCES.find(c => c.id === id);
  if (!clearance) {
    return res.status(404).json({ error: 'Clearance record not found' });
  }

  const { status, stage, pendingAction } = req.body;
  if (status) clearance.status = status;
  if (stage) clearance.stage = stage;
  if (pendingAction) clearance.pendingAction = pendingAction;

  res.status(200).json({ clearance });
});

export default router;
