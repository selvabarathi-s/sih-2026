import { benchmarkingService } from '../services/benchmarkingService.js';

export const getSectorBenchmarks = async (req, res, next) => {
  try {
    const benchmarks = await benchmarkingService.getSectorBenchmarks();
    res.status(200).json({
      data: benchmarks,
      meta: { count: benchmarks.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectBenchmark = async (req, res, next) => {
  try {
    const result = await benchmarkingService.getProjectBenchmark(req.params.id);
    if (!result) {
      return res.status(404).json({
        data: null,
        meta: null,
        error: { code: 'NOT_FOUND', message: `Project '${req.params.id}' not found` },
      });
    }
    res.status(200).json({
      data: result,
      meta: { source: 'PAIMANA Portfolio Benchmarking Engine' },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
