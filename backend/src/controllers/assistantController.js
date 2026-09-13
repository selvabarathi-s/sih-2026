import { assistantService } from '../services/assistantService.js';

export const queryAssistant = async (req, res, next) => {
  try {
    const { query, dataset_mode } = req.body || {};
    if (!query) {
      return res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'INVALID_QUERY', message: 'Query parameter is required in request body' },
      });
    }
    const response = await assistantService.processQuery(query);
    res.status(200).json({
      data: {
        answer: response.content,
        content: response.content,
        evidence: response.evidence,
        intent: response.intent,
        dataset_mode: dataset_mode || 'REAL_PAIMANA',
      },
      meta: {
        timestamp: response.timestamp,
        source: 'MoSPI Table 6 Real PAIMANA Telemetry',
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
