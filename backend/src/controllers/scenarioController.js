import { scenarioService } from '../services/scenarioService.js';

export const simulateScenarios = async (req, res, next) => {
  try {
    const { projectId, interventions } = req.body;
    if (!projectId) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'projectId is required' } });
    }
    const result = await scenarioService.simulateProjectScenarios(projectId, interventions);
    res.status(200).json({
      data: result,
      meta: { methodology: 'model-based-counterfactual-estimation' },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
