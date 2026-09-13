import { demoService } from '../services/demoService.js';

export const getDemoState = (req, res) => {
  res.status(200).json({
    data: demoService.getDemoState(),
    meta: { mode: 'JUDGE_DEMO_CONTROLLER' },
    error: null,
  });
};

export const setDemoStep = (req, res) => {
  const { step } = req.params;
  const state = demoService.setDemoStep(step);
  res.status(200).json({
    data: state,
    error: null,
  });
};

export const resetDemo = (req, res) => {
  const state = demoService.resetDemo();
  res.status(200).json({
    data: state,
    meta: { reset: true },
    error: null,
  });
};
