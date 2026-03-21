import { requestLogger } from '../../middleware/requestLogger';
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

describe('Request Logger Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;
  let mockOn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOn = jest.fn();
    mockReq = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-agent'),
    } as unknown as Partial<Request>;
    mockRes = {
      statusCode: 200,
      on: mockOn,
    } as unknown as Partial<Response>;
    mockNext = jest.fn();
  });

  it('should call next() immediately', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should register finish event listener', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);
    expect(mockOn).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('should log successful requests with info level', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);
    
    const finishCallback = mockOn.mock.calls[0][1];
    mockRes.statusCode = 200;
    finishCallback();
    
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/test',
        statusCode: 200,
      }),
      'Request completed'
    );
  });

  it('should log error requests with warn level', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);
    
    const finishCallback = mockOn.mock.calls[0][1];
    mockRes.statusCode = 404;
    finishCallback();
    
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/test',
        statusCode: 404,
      }),
      'Request completed with error'
    );
  });

  it('should log server errors with warn level', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);
    
    const finishCallback = mockOn.mock.calls[0][1];
    mockRes.statusCode = 500;
    finishCallback();
    
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/test',
        statusCode: 500,
      }),
      'Request completed with error'
    );
  });

  it('should include duration in log', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);
    
    const finishCallback = mockOn.mock.calls[0][1];
    mockRes.statusCode = 200;
    finishCallback();
    
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: expect.stringMatching(/\d+ms/),
      }),
      'Request completed'
    );
  });

  it('should include IP and user agent in log', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);
    
    const finishCallback = mockOn.mock.calls[0][1];
    mockRes.statusCode = 200;
    finishCallback();
    
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        ip: '127.0.0.1',
        userAgent: 'test-agent',
      }),
      'Request completed'
    );
  });
});
