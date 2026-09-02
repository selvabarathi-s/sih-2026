import { assistantService } from '../services/assistantService.js';

export const queryAssistant = async (req, res, next) => {
  try {
    const { query } = req.body || {};
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required in request body' });
    }
    const response = await assistantService.processQuery(query);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
