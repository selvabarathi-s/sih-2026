import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './backend/src/app.js';
import { config } from './backend/src/config/index.js';
import { errorHandler } from './backend/src/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize backend application instance
const app = createApp();

// Serve static frontend assets from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// SPA client-side fallback for frontend React routes (excluding /api routes)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
    return next();
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
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
