import http from 'http';
import { Socket } from 'net';

jest.mock('../services/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../services', () => ({
  cacheService: {
    getStats: jest.fn(() => ({ size: 0, keys: [] })),
    clear: jest.fn(),
  },
}));

jest.mock('../app', () => ({
  __esModule: true,
  default: {
    use: jest.fn(),
    get: jest.fn(),
    listen: jest.fn(),
  },
}));

describe('Server', () => {
  let mockServer: {
    listen: jest.Mock;
    on: jest.Mock;
    close: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    mockServer = {
      listen: jest.fn((port, callback) => {
        callback();
        return mockServer as unknown as http.Server;
      }),
      on: jest.fn(),
      close: jest.fn((callback) => {
        if (callback) callback(null);
        return mockServer as unknown as http.Server;
      }),
    };

    jest.spyOn(http, 'createServer').mockReturnValue(mockServer as unknown as http.Server);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('server startup', () => {
    it('should create HTTP server and listen on configured port', () => {
      process.env.PORT = '3001';
      
      jest.isolateModules(() => {
        require('../server');
      });

      expect(http.createServer).toHaveBeenCalled();
      expect(mockServer.listen).toHaveBeenCalledWith('3001', expect.any(Function));

      delete process.env.PORT;
    });

    it('should use default port 3000 when PORT is not set', () => {
      delete process.env.PORT;
      
      jest.isolateModules(() => {
        require('../server');
      });

      expect(mockServer.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    });
  });

  describe('connection tracking', () => {
    it('should track connections', () => {
      const mockSocket = {
        on: jest.fn(),
        end: jest.fn(),
      };

      let connectionHandler: ((socket: Socket) => void) | undefined;
      mockServer.on.mockImplementation((event, handler) => {
        if (event === 'connection') {
          connectionHandler = handler;
        }
      });

      jest.isolateModules(() => {
        require('../server');
      });

      if (connectionHandler) {
        connectionHandler(mockSocket as unknown as Socket);
      }

      expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
    });
  });

  describe('graceful shutdown', () => {
    it('should register signal handlers', () => {
      const processOnSpy = jest.spyOn(process, 'on');

      jest.isolateModules(() => {
        require('../server');
      });

      expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
      expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
      expect(processOnSpy).toHaveBeenCalledWith('uncaughtException', expect.any(Function));
      expect(processOnSpy).toHaveBeenCalledWith('unhandledRejection', expect.any(Function));

      processOnSpy.mockRestore();
    });
  });

  describe('server error handling', () => {
    it('should handle EADDRINUSE error', () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit');
      });

      let errorHandler: ((err: NodeJS.ErrnoException) => void) | undefined;
      mockServer.on.mockImplementation((event, handler) => {
        if (event === 'error') {
          errorHandler = handler;
        }
      });

      jest.isolateModules(() => {
        require('../server');
      });

      expect(errorHandler).toBeDefined();
      
      if (errorHandler) {
        const handler = errorHandler;
        const err = { code: 'EADDRINUSE' } as NodeJS.ErrnoException;
        expect(() => handler(err)).toThrow('process.exit');
      }

      mockExit.mockRestore();
    });
  });
});
