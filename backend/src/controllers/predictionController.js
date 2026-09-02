import { inferenceService } from '../services/inferenceService.js';
import { weakSignalService } from '../services/weakSignalService.js';
import { anomalyService } from '../services/anomalyService.js';

export const getProjectPredictions = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { asOfDate } = req.query;

    const timeRisk = await inferenceService.predictTimeRisk(projectId, asOfDate);
    const costRisk = await inferenceService.predictCostRisk(projectId, asOfDate);

    res.status(200).json({
      data: {
        projectId,
        asOfDate: timeRisk.asOfDate,
        target: 'adverse_deterioration_event',
        forecastHorizon: '90_days',
        probability: timeRisk.predictedProbability,
        prediction: timeRisk.riskLevel,
        predictedDelayMonths: timeRisk.predictedDelayMonths,
        decisionThreshold: 0.45,
        modelId: timeRisk.modelId,
        modelVersion: '1.4.0',
        datasetVersion: 'PAIMANA-APR2026-MULTI10',
        featureVersion: 'v2.1',
        targetVersion: 'v1.2',
        timeRisk,
        costRisk,
        explanation: {
          topContributingFeatures: timeRisk.topContributingFeatures,
          method: 'Local Feature Attribution',
        },
        provenance: {
          sourceDocument: 'MoSPI Table 6 Multi-Snapshot Stream',
          ruleTAntiLeakage: 'ENFORCED',
          evaluatedAsOf: timeRisk.asOfDate,
        },
      },
      meta: {
        modelId: timeRisk.modelId,
        confidence: timeRisk.confidence,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectRisk = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { asOfDate } = req.query;

    const momentum = await inferenceService.calculateRiskMomentum(projectId, asOfDate);

    res.status(200).json({
      data: {
        projectId,
        momentum,
      },
      meta: { asOfDate: momentum.asOfDate },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectSignals = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { asOfDate } = req.query;

    const signals = await weakSignalService.detectSignals(projectId, asOfDate);

    res.status(200).json({
      data: signals,
      meta: { asOfPeriod: signals.asOfPeriod },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectAnomalies = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { asOfDate } = req.query;

    const anomaly = await anomalyService.detectAnomaly(projectId, asOfDate);

    res.status(200).json({
      data: anomaly,
      meta: { asOfPeriod: anomaly.asOfPeriod },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectPrescription = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { asOfDate } = req.query;

    const prescription = await inferenceService.calculatePrescription(projectId, asOfDate);

    res.status(200).json({
      data: prescription,
      meta: { asOfDate: prescription.asOfDate },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
