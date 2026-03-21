import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../errors';

export const createRateLimiter = (options?: {
  windowMs?: number;
  max?: number;
  message?: string;
}) => {
  const windowMs = options?.windowMs ?? 15 * 60 * 1000;
  const max = options?.max ?? 100;
  const message = options?.message ?? 'Too many requests from this IP, please try again later.';

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    /* istanbul ignore next */
    handler: (_req, _res, _next, _options) => {
      throw new RateLimitError(message);
    },
    skip: (req) => {
      return req.path === '/health' || req.path === '/';
    },
  });
};

export const rateLimiter = createRateLimiter();

export const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests, please slow down.',
});
