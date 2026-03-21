import { createRateLimiter, rateLimiter, strictRateLimiter } from '../../middleware/rateLimiter';
import { RateLimitError } from '../../errors';
import { Request, Response } from 'express';

describe('Rate Limiter Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      path: '/test',
      ip: '127.0.0.1',
    } as Partial<Request>;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    } as Partial<Response>;
    mockNext = jest.fn();
  });

  describe('createRateLimiter', () => {
    it('should create a rate limiter with default options', () => {
      const limiter = createRateLimiter();
      expect(limiter).toBeDefined();
    });

    it('should create a rate limiter with custom options', () => {
      const limiter = createRateLimiter({
        windowMs: 60000,
        max: 50,
        message: 'Custom message',
      });
      expect(limiter).toBeDefined();
    });

    it('should skip rate limiting for health endpoint', async () => {
      mockReq = { ...mockReq, path: '/health' } as Partial<Request>;
      const limiter = createRateLimiter();
      
      await new Promise<void>((resolve) => {
        limiter(mockReq as Request, mockRes as Response, () => {
          mockNext();
          resolve();
        });
      });
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('should skip rate limiting for root endpoint', async () => {
      mockReq = { ...mockReq, path: '/' } as Partial<Request>;
      const limiter = createRateLimiter();
      
      await new Promise<void>((resolve) => {
        limiter(mockReq as Request, mockRes as Response, () => {
          mockNext();
          resolve();
        });
      });
      
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('rateLimiter', () => {
    it('should be defined with default settings', () => {
      expect(rateLimiter).toBeDefined();
    });
  });

  describe('strictRateLimiter', () => {
    it('should be defined with strict settings', () => {
      expect(strictRateLimiter).toBeDefined();
    });
  });
});
