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
      page: parseInt(req.query.page || '1', 10),
      pageSize: parseInt(req.query.pageSize || req.query.limit || '20', 10),
      limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset, 10) : undefined,
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
      return res.status(404).json({
        data: null,
        meta: null,
        error: { code: 'NOT_FOUND', message: `Project '${req.params.id}' not found` },
      });
    }
    res.status(200).json({
      data: project,
      meta: {
        source: 'PAIMANA Flash Report (Table 6)',
        report_period: 'April 2026',
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectHistory = async (req, res, next) => {
  try {
    const snapshots = await projectService.getProjectSnapshots(req.params.id);
    res.status(200).json({
      data: snapshots,
      meta: {
        project_id: req.params.id,
        count: snapshots.length,
        snapshot_depth: '10 monthly reporting periods (Oct 2025 - Jul 2026)',
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
