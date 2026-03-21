import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { ErrorResponse } from '../types';
import logger from '../services/logger';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: {
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        details: err.details,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  const response: ErrorResponse = {
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    },
  };
  res.status(500).json(response);
}

export function notFoundHandler(req: Request, res: Response): void {
  logger.warn({
    message: `Route not found: ${req.method} ${req.path}`,
    method: req.method,
    path: req.path,
  });

  const response: ErrorResponse = {
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'NOT_FOUND',
      statusCode: 404,
    },
  };
  res.status(404).json(response);
}
