const { Log } = require('./logger');

function requestLogger(req, res, next) {
  // Log in the evaluation server format
  Log('backend', 'INFO', 'route', `${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    requestBody: req.body,
    headers: req.headers
  });
  next();
}

async function errorLogger(err, req, res, next) {
  // Log errors in the evaluation server format
  Log('backend', 'ERROR', 'error', err.message || 'Unknown error', {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    requestBody: req.body,
    headers: req.headers
  });
  next(err);
}

module.exports = { requestLogger, errorLogger };
