// ==============================================================================
// PAIMANA PREDICT — MULTI-PROJECT DEPENDENCY & SYSTEMIC RISK SERVICE
// Inter-Project Graph, Cascading Delay Impact Analysis & Portfolio Risk Alerts
// ==============================================================================

import { projectRepository } from '../repositories/projectRepository.js';
import { auditService } from './auditService.js';
import { eventBus, DOMAIN_EVENTS } from './eventBus.js';

class DependencyService {
  constructor() {
    this.dependencies = [
      {
        dependencyId: 'DEP-001',
        upstreamProjectId: 'PAI-705728',
        upstreamProjectName: 'Mumbai-Ahmedabad High Speed Rail',
        downstreamProjectId: 'PAI-706775',
        downstreamProjectName: 'BharatNet Phase-II (Maharashtra Sector)',
        dependencyType: 'UTILITY_RELOCATION',
        description: 'Underground optical fiber ducting shared along the Western Railway corridor alignment.',
        criticality: 'CRITICAL',
        bufferDays: 30,
      },
      {
        dependencyId: 'DEP-002',
        upstreamProjectId: 'PAI-704992',
        upstreamProjectName: 'Western Dedicated Freight Corridor',
        downstreamProjectId: 'PAI-703881',
        downstreamProjectName: 'Delhi-Mumbai Expressway Phase-1',
        dependencyType: 'PHYSICAL_INTERFACE',
        description: 'Grade separator rail-over-bridge (ROB) interchange at Vadodara junction.',
        criticality: 'HIGH',
        bufferDays: 45,
      },
    ];
  }

  async getAllDependencies() {
    return this.dependencies;
  }

  async getDependenciesForProject(projectId) {
    const cleanId = (projectId || '').trim();
    const upstream = this.dependencies.filter(
      d => d.downstreamProjectId.toLowerCase() === cleanId.toLowerCase()
    );
    const downstream = this.dependencies.filter(
      d => d.upstreamProjectId.toLowerCase() === cleanId.toLowerCase()
    );

    return {
      projectId: cleanId,
      upstreamPrerequisites: upstream,
      downstreamDependents: downstream,
      totalConnectedProjects: upstream.length + downstream.length,
    };
  }

  async addDependency(data, actor) {
    const { upstreamProjectId, downstreamProjectId, dependencyType, description, criticality = 'HIGH', bufferDays = 30 } = data;

    if (!upstreamProjectId || !downstreamProjectId || !dependencyType) {
      const err = new Error('upstreamProjectId, downstreamProjectId, and dependencyType are required.');
      err.statusCode = 400;
      throw err;
    }

    if (upstreamProjectId.toLowerCase() === downstreamProjectId.toLowerCase()) {
      const err = new Error('Self-dependency is invalid.');
      err.statusCode = 400;
      throw err;
    }

    const upProj = await projectRepository.findById(upstreamProjectId);
    const downProj = await projectRepository.findById(downstreamProjectId);

    const depRecord = {
      dependencyId: `DEP-${Date.now()}`,
      upstreamProjectId: upProj?.project_id || upstreamProjectId,
      upstreamProjectName: upProj?.project_name || upstreamProjectId,
      downstreamProjectId: downProj?.project_id || downstreamProjectId,
      downstreamProjectName: downProj?.project_name || downstreamProjectId,
      dependencyType,
      description: description || 'Inter-project physical or statutory interface',
      criticality,
      bufferDays: Number(bufferDays),
      createdAt: new Date().toISOString(),
      createdBy: actor?.fullName || 'System Admin',
    };

    this.dependencies.push(depRecord);

    await auditService.logEvent({
      action: 'PROJECT_DEPENDENCY_CREATED',
      userId: actor?.id || 'admin',
      userRole: actor?.role || 'system_admin',
      resourceType: 'DEPENDENCY_GRAPH',
      resourceId: depRecord.dependencyId,
      details: { upstream: depRecord.upstreamProjectId, downstream: depRecord.downstreamProjectId },
    });

    return depRecord;
  }

  async calculateCascadeImpact(projectId, additionalDelayMonths = 6) {
    const cleanId = (projectId || '').trim();
    const directDownstream = this.dependencies.filter(
      d => d.upstreamProjectId.toLowerCase() === cleanId.toLowerCase()
    );

    const impacts = [];
    for (const dep of directDownstream) {
      const downProj = await projectRepository.findById(dep.downstreamProjectId);
      const bufferMonths = dep.bufferDays / 30;
      const netSlippage = Math.max(0, additionalDelayMonths - bufferMonths);

      if (netSlippage > 0) {
        impacts.push({
          downstreamProjectId: dep.downstreamProjectId,
          downstreamProjectName: dep.downstreamProjectName,
          dependencyType: dep.dependencyType,
          criticality: dep.criticality,
          bufferExceededMonths: Number(netSlippage.toFixed(1)),
          estimatedFinancialImpactCr: downProj ? Number((downProj.revised_cost * (netSlippage / 12) * 0.05).toFixed(2)) : 0,
          recommendedMitigation: 'Activate emergency inter-departmental corridor taskforce to decouple critical path.',
        });
      }
    }

    if (impacts.length > 0) {
      await eventBus.publish(DOMAIN_EVENTS.SYSTEMIC_RISK_DETECTED, {
        upstreamProjectId: cleanId,
        additionalDelayMonths,
        cascadingImpacts: impacts,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      upstreamProjectId: cleanId,
      assumedDelayMonths: additionalDelayMonths,
      cascadingImpactCount: impacts.length,
      impactedProjects: impacts,
    };
  }
}

export const dependencyService = new DependencyService();
