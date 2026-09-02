import { config } from '../config/index.js';

export const requestLogger = (req, res, next) => {
  if (!config.logging.enableRequestLogging) return next();

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};
