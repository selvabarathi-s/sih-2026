import { projectRepository } from '../repositories/projectRepository.js';
import { snapshotRepository } from '../repositories/snapshotRepository.js';

class ProjectService {
  async getProjects(filters) {
    return await projectRepository.findAll(filters);
  }

  async getProjectDetails(id) {
    const project = await projectRepository.findById(id);
    if (!project) return null;

    const snapshots = await snapshotRepository.findByProjectCode(project.project_code);

    return {
      ...project,
      snapshots,
      snapshot_count: snapshots.length,
      unprovided_fields_notice: [
        'Contractor Performance Internal Score',
        'Right-of-Way (ROW) Land Handover Percentage',
        '400kV / 220kV Utility Line Shifting Clearances',
        'Labor Availability Index',
        'Weather Disruption Index'
      ]
    };
  }

  async getProjectSnapshots(id) {
    const project = await projectRepository.findById(id);
    if (!project) return [];
    return await snapshotRepository.findByProjectCode(project.project_code);
  }
}

export const projectService = new ProjectService();
