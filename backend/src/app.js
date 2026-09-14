import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/rbac.js';
import v1Routes from './routes/v1/index.js';
import { getHealth, getDataHealth, getMlHealth } from './controllers/healthController.js';

export const createApp = () => {
  const app = express();

  // Core Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(config.cors));
  app.use(requestLogger);
  app.use(authenticate); // Populate req.user from Authorization headers across all endpoints

  // Root & Health Probes (Direct & Versioned)
  app.get('/health', getHealth);
  app.get('/health/data', getDataHealth);
  app.get('/health/ml', getMlHealth);
  app.get('/healthz', getHealth); // Render health check backward compatibility

  // API v1 Versioned Router
  app.use(config.apiPrefix, v1Routes);

  // Catch unmapped API endpoints with structured JSON 404
  app.use(config.apiPrefix, (req, res) => {
    res.status(404).json({
      data: null,
      meta: null,
      error: {
        code: 'NOT_FOUND',
        message: `API resource '${req.method} ${req.originalUrl}' not found.`,
        statusCode: 404,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  });

  return app;
};
