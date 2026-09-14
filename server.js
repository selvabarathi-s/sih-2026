import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './backend/src/app.js';
import { config } from './backend/src/config/index.js';
import { errorHandler } from './backend/src/middleware/errorHandler.js';

import { automationWorker } from './backend/src/services/automationWorker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize backend application instance
const app = createApp();

// Serve static frontend assets from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

const VALID_FRONTEND_ROUTES = [
  '/',
  '/login',
  '/dashboard',
  '/monitoring',
  '/decisions',
  '/quality',
  '/cases',
  '/monthly-updates',
  '/ministry-overview',
  '/engineering',
  '/supervision',
  '/coordination',
  '/state-coordination',
  '/investment-review',
  '/financial-review',
  '/governance',
  '/audit',
  '/security',
  '/analytics',
  '/finance',
  '/dependencies',
  '/data-governance',
  '/settings',
  '/projects',
  '/models',
  '/reports',
];

// SPA client-side fallback strictly for recognized frontend application routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
    return next();
  }

  // Reject file extensions not in dist, traversal markers, or unrecognized URL paths
  if (path.extname(req.path) || req.path.includes('..')) {
    return res.status(404).send('Not Found');
  }

  const isKnownRoute = VALID_FRONTEND_ROUTES.some(
    r => req.path === r || req.path.startsWith(`${r}/`)
  );

  if (!isKnownRoute) {
    return res.status(404).send('Not Found');
  }

  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const server = app.listen(config.port, config.host, () => {
  console.log(`================================================================================`);
  console.log(`PAIMANA PREDICT: Unified Full-Stack Application Running`);
  console.log(`• Environment: ${config.env}`);
  console.log(`• Web Service: http://${config.host}:${config.port}`);
  console.log(`• API v1 Root: http://${config.host}:${config.port}${config.apiPrefix}`);
  console.log(`• Health Check: http://${config.host}:${config.port}/health`);
  console.log(`• Data Health: http://${config.host}:${config.port}/health/data`);
  console.log(`• ML Health:   http://${config.host}:${config.port}/health/ml`);
  console.log(`================================================================================`);

  // Start background automation daemon
  automationWorker.start(60000);
});

// Socket & Connection Timeouts (protects against slowloris and hung sockets under 300-1000 concurrent users)
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
server.requestTimeout = 30000;

// Process-level uncaught exception & unhandled rejection shields
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL SHIELD] Uncaught Exception trapped:', err?.stack || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL SHIELD] Unhandled Rejection at:', promise, 'reason:', reason?.stack || reason);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`${signal} signal received: initiating graceful shutdown`);
  automationWorker.stop();
  server.close(() => {
    console.log('HTTP server closed gracefully');
    process.exit(0);
  });
  // Force exit after 10s if hanging sockets remain
  setTimeout(() => {
    console.error('Forcefully terminating process after shutdown timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
