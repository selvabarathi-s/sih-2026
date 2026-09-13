import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

class PredictionService {
  constructor() {
    this.metricsData = null;
    this.loadMetrics();
  }

  loadMetrics() {
    try {
      const metricsPath = path.join(config.paths.root, 'src/data/computedModelMetrics.json');
      if (fs.existsSync(metricsPath)) {
        this.metricsData = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
      }
    } catch (err) {
      console.error('Error loading prediction metrics:', err);
    }
  }

  async getModelRegistry() {
    if (!this.metricsData) this.loadMetrics();
    return {
      metadata: this.metricsData?.metadata || {},
      cost_overrun_models: this.metricsData?.cost_overrun_models || {},
      time_overrun_models: this.metricsData?.time_overrun_models || {},
      cuf_vs_expanded_comparison: this.metricsData?.cuf_vs_expanded_comparison || {},
      feature_importance: this.metricsData?.feature_importance || {},
      governance_rule: 'Strict Anti-Leakage Policy: Features at time T only use historical information at or prior to T.'
    };
  }
}

export const predictionService = new PredictionService();
