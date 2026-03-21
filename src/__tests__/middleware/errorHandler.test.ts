import { errorHandler, notFoundHandler } from '../../middleware/errorHandler';
import { AppError, ValidationError, NotFoundError, ExternalApiError, RateLimitError } from '../../errors';
import { Request, Response } from 'express';

jest.mock('../../services/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import logger from '../../services/logger';

describe('Error Handler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockReq = { method: 'GET', path: '/test', originalUrl: '/test', ip: '127.0.0.1' };
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      status: mockStatus,
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle AppError correctly', () => {
      const error = new ValidationError('Invalid input', { field: 'test' });
      
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());
      
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: {
          message: 'Invalid input',
          code: 'VALIDATION_ERROR',
          statusCode: 400,
          details: { field: 'test' },
        },
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle NotFoundError correctly', () => {
      const error = new NotFoundError('Resource not found');
      
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());
      
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: {
          message: 'Resource not found',
          code: 'NOT_FOUND',
          statusCode: 404,
        },
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle ExternalApiError correctly', () => {
      const error = new ExternalApiError('External API failed', { status: 502 });
      
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());
      
      expect(mockStatus).toHaveBeenCalledWith(502);
      expect(mockJson).toHaveBeenCalledWith({
        error: {
          message: 'External API failed',
          code: 'EXTERNAL_API_ERROR',
          statusCode: 502,
          details: { status: 502 },
        },
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle RateLimitError correctly', () => {
      const error = new RateLimitError();
      
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());
      
      expect(mockStatus).toHaveBeenCalledWith(429);
      expect(mockJson).toHaveBeenCalledWith({
        error: {
          message: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          statusCode: 429,
        },
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle RateLimitError with custom message', () => {
      const error = new RateLimitError('Too many requests', { limit: 100 });
      
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());
      
      expect(mockStatus).toHaveBeenCalledWith(429);
      expect(mockJson).toHaveBeenCalledWith({
        error: {
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          statusCode: 429,
          details: { limit: 100 },
        },
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle generic Error as internal server error', () => {
      const error = new Error('Something went wrong');
      
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());
      
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          statusCode: 500,
        },
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should log error with request details', () => {
      const error = new Error('Test error');
      
      errorHandler(error, mockReq as Request, mockRes as Response, jest.fn());
      
      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Test error',
          method: 'GET',
          url: '/test',
          ip: '127.0.0.1',
        })
      );
    });
  });

  describe('notFoundHandler', () => {
    it('should return 404 with route info', () => {
      mockReq = { method: 'POST', path: '/unknown' };
      
      notFoundHandler(mockReq as Request, mockRes as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: {
          message: 'Route POST /unknown not found',
          code: 'NOT_FOUND',
          statusCode: 404,
        },
      });
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should log warning with route details', () => {
      mockReq = { method: 'GET', path: '/missing' };
      
      notFoundHandler(mockReq as Request, mockRes as Response);
      
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Route not found: GET /missing',
          method: 'GET',
          path: '/missing',
        })
      );
    });
  });
});
