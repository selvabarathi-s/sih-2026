// ==============================================================================
// PAIMANA PREDICT — PROJECT REGISTRATION & MASTER RECORD SERVICE
// Master Record Creation with Duplicate Detection & Strict Validation
// ==============================================================================

import { projectRepository } from '../repositories/projectRepository.js';
import { projectLifecycleService } from './projectLifecycleService.js';
import { PROJECT_OPERATIONAL_STATES } from '../models/stateMachines.js';
import { auditService } from './auditService.js';
import { eventBus, DOMAIN_EVENTS } from './eventBus.js';

class ProjectRegistrationService {
  constructor() {
    this.customProjects = new Map();
  }

  // Multi-method string similarity calculation (Levenshtein + Token Overlap + Substring)
  calculateSimilarity(s1, s2) {
    if (!s1 || !s2) return 0;
    const str1 = s1.toLowerCase().trim();
    const str2 = s2.toLowerCase().trim();
    if (str1 === str2) return 1.0;

    // Substring containment check
    if (str1.includes(str2) || str2.includes(str1)) {
      const minLen = Math.min(str1.length, str2.length);
      const maxLen = Math.max(str1.length, str2.length);
      if (minLen >= 5) {
        return Math.max(0.85, minLen / maxLen);
      }
    }

    // Token Jaccard similarity
    const tokens1 = new Set(str1.split(/\s+/).filter(t => t.length > 2));
    const tokens2 = new Set(str2.split(/\s+/).filter(t => t.length > 2));
    let commonTokens = 0;
    for (const t of tokens1) {
      if (tokens2.has(t)) commonTokens++;
    }
    const unionTokens = new Set([...tokens1, ...tokens2]).size;
    const tokenSim = unionTokens > 0 ? commonTokens / unionTokens : 0;

    // Levenshtein edit distance
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const costs = [];
    for (let i = 0; i <= longer.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= shorter.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[shorter.length] = lastValue;
    }
    const levSim = (longer.length - costs[shorter.length]) / longer.length;

    return Math.max(levSim, tokenSim);
  }

  async detectDuplicates(registrationData) {
    const { project_name, sector, state, agency } = registrationData;
    const allProjectsRes = await projectRepository.findAll({ pageSize: 5000 });
    const existing = allProjectsRes.data || [];

    const potentialMatches = [];

    for (const proj of existing) {
      const nameSim = this.calculateSimilarity(project_name, proj.project_name);
      let matchScore = nameSim * 0.7;

      if (sector && proj.sector && proj.sector.toLowerCase() === sector.toLowerCase()) {
        matchScore += 0.1;
      }
      if (state && proj.state && proj.state.toLowerCase() === state.toLowerCase()) {
        matchScore += 0.1;
      }
      if (agency && proj.agency && proj.agency.toLowerCase() === agency.toLowerCase()) {
        matchScore += 0.1;
      }

      if (matchScore >= 0.65 || nameSim >= 0.75) {
        potentialMatches.push({
          projectId: proj.project_id,
          projectName: proj.project_name,
          sector: proj.sector,
          state: proj.state,
          agency: proj.agency,
          similarityScore: Math.round(matchScore * 100),
          matchReason: nameSim >= 0.85
            ? 'Near-identical project title'
            : 'High semantic title similarity in matching sector/state',
        });
      }
    }

    potentialMatches.sort((a, b) => b.similarityScore - a.similarityScore);
    return potentialMatches;
  }

  async registerProject(data, actor) {
    // 1. Mandatory Fields Validation
    const required = ['project_name', 'ministry', 'sector', 'state', 'agency', 'original_cost', 'original_completion_date'];
    const missing = required.filter(f => !data[f] || (typeof data[f] === 'string' && !data[f].trim()));

    if (missing.length > 0) {
      const err = new Error(`Validation Failed: Mandatory fields missing: ${missing.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const originalCost = Number(data.original_cost);
    if (isNaN(originalCost) || originalCost <= 0) {
      const err = new Error('Validation Failed: original_cost must be a positive number in ₹ Crores.');
      err.statusCode = 400;
      throw err;
    }

    // 2. Duplicate Detection Check
    const duplicates = await this.detectDuplicates(data);
    if (duplicates.length > 0 && duplicates[0].similarityScore > 90 && !data.bypassDuplicateWarning) {
      const err = new Error(`Potential Duplicate Detected: Matches existing project ${duplicates[0].projectId} (${duplicates[0].projectName}) with ${duplicates[0].similarityScore}% similarity. Provide bypassDuplicateWarning: true if this is an authorized distinct phase.`);
      err.statusCode = 409;
      err.duplicateMatches = duplicates;
      throw err;
    }

    // 3. Generate Official Unique Project Identifier
    const year = new Date().getFullYear();
    const randCode = Math.floor(100000 + Math.random() * 900000);
    const projectId = `PAI-${randCode}`;
    const projectCode = `${randCode}`;

    // 4. Construct Master Record
    const masterRecord = {
      project_id: projectId,
      project_code: projectCode,
      project_name: data.project_name.trim(),
      ministry: data.ministry.trim(),
      sector: data.sector.trim(),
      state: data.state.trim(),
      agency: data.agency.trim(),
      original_cost: originalCost,
      revised_cost: originalCost,
      cumulative_expenditure: Number(data.cumulative_expenditure || 0),
      physical_progress: Number(data.physical_progress || 0),
      cost_growth_pct: 0,
      cost_overrun_cr: 0,
      schedule_extension_months: 0,
      original_completion_date: data.original_completion_date,
      anticipated_completion_date: data.original_completion_date,
      nodal_officer: data.nodal_officer || {
        name: actor?.fullName || 'Project Nodal Officer',
        email: actor?.email || 'nodal@agency.gov.in',
        phone: data.nodal_phone || '+91-11-23000000',
        designation: data.nodal_designation || 'Project Director',
      },
      contractor_name: data.contractor_name || 'To Be Tendered / EPC Contract',
      milestones: Array.isArray(data.milestones) ? data.milestones : [],
      description: data.description || '',
      created_by: actor?.fullName || 'Registration Officer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      record_version: 1,
      is_cost_escalated: false,
      is_schedule_extended: false,
    };

    // 5. Store in project repository cache & local store
    this.customProjects.set(projectId, masterRecord);
    if (projectRepository.projectsCache) {
      projectRepository.projectsCache.unshift(masterRecord);
    }

    // 6. Initialize lifecycle state to DRAFT and transition to SUBMITTED
    projectLifecycleService.initializeProjectState(projectId, PROJECT_OPERATIONAL_STATES.DRAFT);
    await projectLifecycleService.transitionState(
      projectId,
      PROJECT_OPERATIONAL_STATES.SUBMITTED,
      actor,
      { reason: 'Initial project master registration submitted for validation' }
    );

    // 7. Audit log & Event publishing
    await auditService.logEvent({
      action: 'PROJECT_MASTER_REGISTERED',
      userId: actor?.id || 'system',
      userRole: actor?.role || 'PROJECT_ADMIN',
      resourceType: 'PROJECT_MASTER',
      resourceId: projectId,
      details: {
        projectName: masterRecord.project_name,
        ministry: masterRecord.ministry,
        cost: masterRecord.original_cost,
        agency: masterRecord.agency,
      },
    });

    await eventBus.publish(DOMAIN_EVENTS.PROJECT_CREATED, {
      projectId,
      projectName: masterRecord.project_name,
      agency: masterRecord.agency,
      cost: masterRecord.original_cost,
      actor: { id: actor?.id, name: actor?.fullName, role: actor?.role },
      timestamp: masterRecord.created_at,
    });

    return {
      success: true,
      message: 'Project master record created and submitted for verification successfully.',
      project: masterRecord,
      duplicateWarnings: duplicates.slice(0, 3),
    };
  }
}

export const projectRegistrationService = new ProjectRegistrationService();
