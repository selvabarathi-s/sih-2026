export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.stack || err);

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  });
};
