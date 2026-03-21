export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, statusCode: number, code: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ExternalApiError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 502, 'EXTERNAL_API_ERROR', details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', details?: Record<string, unknown>) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', details?: Record<string, unknown>) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
  }
}
