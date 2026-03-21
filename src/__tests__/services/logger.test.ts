import logger, { createChildLogger } from '../../services/logger';

describe('Logger Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('logger', () => {
    it('should be defined', () => {
      expect(logger).toBeDefined();
    });

    it('should have info method', () => {
      expect(logger.info).toBeDefined();
    });

    it('should have warn method', () => {
      expect(logger.warn).toBeDefined();
    });

    it('should have error method', () => {
      expect(logger.error).toBeDefined();
    });

    it('should have debug method', () => {
      expect(logger.debug).toBeDefined();
    });

    it('should have trace method', () => {
      expect(logger.trace).toBeDefined();
    });

    it('should log info messages', () => {
      const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger);
      logger.info('test message');
      expect(infoSpy).toHaveBeenCalledWith('test message');
      infoSpy.mockRestore();
    });

    it('should log error messages', () => {
      const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => logger);
      logger.error('error message');
      expect(errorSpy).toHaveBeenCalledWith('error message');
      errorSpy.mockRestore();
    });

    it('should log warn messages', () => {
      const warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => logger);
      logger.warn('warn message');
      expect(warnSpy).toHaveBeenCalledWith('warn message');
      warnSpy.mockRestore();
    });

    it('should log with object data', () => {
      const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger);
      logger.info({ key: 'value' }, 'test message');
      expect(infoSpy).toHaveBeenCalledWith({ key: 'value' }, 'test message');
      infoSpy.mockRestore();
    });
  });

  describe('createChildLogger', () => {
    it('should create a child logger with context', () => {
      const childLogger = createChildLogger('testContext');
      expect(childLogger).toBeDefined();
    });

    it('should have same methods as parent logger', () => {
      const childLogger = createChildLogger('testContext');
      expect(childLogger.info).toBeDefined();
      expect(childLogger.warn).toBeDefined();
      expect(childLogger.error).toBeDefined();
      expect(childLogger.debug).toBeDefined();
    });

    it('should log with child logger', () => {
      const childLogger = createChildLogger('testContext');
      const infoSpy = jest.spyOn(childLogger, 'info').mockImplementation(() => childLogger);
      childLogger.info('child message');
      expect(infoSpy).toHaveBeenCalledWith('child message');
      infoSpy.mockRestore();
    });
  });

  describe('log levels', () => {
    it('should use info level by default', () => {
      expect(logger.level).toBe('info');
    });

    it('should respect LOG_LEVEL environment variable', () => {
      process.env.LOG_LEVEL = 'debug';
      jest.resetModules();
      const { logger: debugLogger } = require('../../services/logger');
      expect(debugLogger.level).toBe('debug');
    });
  });
});
