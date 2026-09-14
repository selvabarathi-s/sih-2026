export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'SERVER_ERROR';
  let details = err.validationFlags || err.details || null;

  // 1. Handle body-parser JSON parse errors (SyntaxError)
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err)) {
    statusCode = 400;
    code = 'MALFORMED_JSON';
    message = 'Malformed JSON syntax in request body. Please verify request formatting.';
  }
  // 2. Handle body-parser entity too large (DoS protection)
  else if (err.type === 'entity.too.large' || err.status === 413) {
    statusCode = 413;
    code = 'PAYLOAD_TOO_LARGE';
    message = 'Request payload exceeds the maximum allowed size (10MB limit).';
  }
  // 3. Handle malformed URI components
  else if (err instanceof URIError) {
    statusCode = 400;
    code = 'MALFORMED_URI';
    message = 'Malformed URI encoding in request URL.';
  }

  // Log 5xx errors for internal diagnosis while hiding internal stack from client
  if (statusCode >= 500) {
    console.error(`[CRITICAL 5xx] ${req.method} ${req.originalUrl}:`, err?.stack || err);
  } else {
    console.warn(`[Client ${statusCode}] ${req.method} ${req.originalUrl}: ${message}`);
  }

  res.status(statusCode).json({
    data: null,
    meta: null,
    error: {
      code,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      ...(details ? { details } : {}),
    },
  });
};
