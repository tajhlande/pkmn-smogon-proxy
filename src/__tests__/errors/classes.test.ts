import { AppError, ValidationError, NotFoundError, ExternalApiError, RateLimitError } from '../../errors/classes';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an error with all properties', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR', { field: 'test' });
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.details).toEqual({ field: 'test' });
      expect(error.name).toBe('AppError');
    });

    it('should create an error without details', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR');
      
      expect(error.details).toBeUndefined();
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error with correct properties', () => {
      const error = new ValidationError('Invalid input', { field: 'email' });
      
      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual({ field: 'email' });
    });

    it('should create a validation error without details', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error.details).toBeUndefined();
    });
  });

  describe('NotFoundError', () => {
    it('should create a not found error with correct properties', () => {
      const error = new NotFoundError('Resource not found', { id: '123' });
      
      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.details).toEqual({ id: '123' });
    });

    it('should create a not found error without details', () => {
      const error = new NotFoundError('Resource not found');
      
      expect(error.details).toBeUndefined();
    });
  });

  describe('ExternalApiError', () => {
    it('should create an external API error with correct properties', () => {
      const error = new ExternalApiError('API failed', { status: 502 });
      
      expect(error.message).toBe('API failed');
      expect(error.statusCode).toBe(502);
      expect(error.code).toBe('EXTERNAL_API_ERROR');
      expect(error.details).toEqual({ status: 502 });
    });

    it('should create an external API error without details', () => {
      const error = new ExternalApiError('API failed');
      
      expect(error.details).toBeUndefined();
    });
  });

  describe('RateLimitError', () => {
    it('should create a rate limit error with default message', () => {
      const error = new RateLimitError();
      
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(error.details).toBeUndefined();
    });

    it('should create a rate limit error with custom message', () => {
      const error = new RateLimitError('Too many requests', { limit: 100 });
      
      expect(error.message).toBe('Too many requests');
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(error.details).toEqual({ limit: 100 });
    });
  });
});
