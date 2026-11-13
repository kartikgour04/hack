import { AppError, notFound, validationError } from '../utils/errors.js';

// Any /api path that no route matched.
export function apiNotFound(req, res, next) {
  next(notFound(`There is no API endpoint ${req.method} ${req.originalUrl}`));
}

// Every error ends here, so all error responses have the same shape.
export function errorHandler(err, req, res, next) {
  const appError = toAppError(err);
  if (appError) {
    res.status(appError.status).json({ error: { code: appError.code, message: appError.message } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL', message: 'Something went wrong on the server.' } });
}

function toAppError(err) {
  if (err instanceof AppError) return err;
  if (err.type === 'entity.parse.failed') return validationError('The request body is not valid JSON.');
  return null;
}
