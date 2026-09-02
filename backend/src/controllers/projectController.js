import { projectService } from '../services/projectService.js';

export const listProjects = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      ministry: req.query.ministry,
      sector: req.query.sector,
      state: req.query.state,
      costEscalatedOnly: req.query.costEscalatedOnly === 'true',
      scheduleExtendedOnly: req.query.scheduleExtendedOnly === 'true',
      limit: parseInt(req.query.limit || '50', 10),
      offset: parseInt(req.query.offset || '0', 10),
      sortBy: req.query.sortBy || 'revised_cost',
      sortOrder: req.query.sortOrder || 'desc',
    };

    const result = await projectService.getProjects(filters);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectDetails(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found', project_id: req.params.id });
    }
    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
};

export const getProjectHistory = async (req, res, next) => {
  try {
    const snapshots = await projectService.getProjectSnapshots(req.params.id);
    res.status(200).json({ project_id: req.params.id, count: snapshots.length, snapshots });
  } catch (err) {
    next(err);
  }
};
