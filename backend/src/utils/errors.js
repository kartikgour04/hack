// Services throw these; the central error handler turns them into
// { "error": { "code", "message" } } with the matching HTTP status.
export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const validationError = (message) => new AppError(400, 'VALIDATION', message);
export const forbidden = (message) => new AppError(403, 'FORBIDDEN', message);
export const notFound = (message) => new AppError(404, 'NOT_FOUND', message);
export const conflict = (message) => new AppError(409, 'CONFLICT', message);
