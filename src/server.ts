import http from 'http';
import { Socket } from 'net';
import app from './app';
import logger from './services/logger';
import { cacheService } from './services';

logger.info("PORT from env: `" + process.env.PORT + "`");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const SHUTDOWN_TIMEOUT = parseInt(process.env.SHUTDOWN_TIMEOUT || '10000', 10);

let server: http.Server;
let isShuttingDown = false;

const activeConnections = new Set<Socket>();

function trackConnections(srv: http.Server): void {
  srv.on('connection', (socket: Socket) => {
    activeConnections.add(socket);
    socket.on('close', () => {
      activeConnections.delete(socket);
    });
  });
}

function cleanup(): void {
  logger.info('Clearing cache...');
  cacheService.clear();
  logger.info('Cache cleared');
}

function gracefulShutdown(signal: string): void {
  if (isShuttingDown) {
    logger.info(`Already shutting down, ignoring ${signal}`);
    return;
  }

  isShuttingDown = true;
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  const shutdownTimer = setTimeout(() => {
    logger.warn('Forcing shutdown after timeout');
    cleanup();
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  server.close((err) => {
    clearTimeout(shutdownTimer);
    
    if (err) {
      logger.error({ err }, 'Error during server close');
      cleanup();
      process.exit(1);
    }

    logger.info('HTTP server closed');

    cleanup();

    logger.info('Graceful shutdown complete');
    process.exit(0);
  });

  activeConnections.forEach((socket) => {
    socket.end();
  });
}

function startServer(): void {
  server = http.createServer(app);

  trackConnections(server);

  logger.info("PORT from env: `" + process.env.PORT + "`");
  server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use`);
      process.exit(1);
    }
    logger.error({ err }, 'Server error');
  });

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('uncaughtException', (err) => {
    logger.error({ err }, 'Uncaught exception');
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Unhandled rejection');
  });
}

startServer();

export { server, isShuttingDown as isServerShuttingDown };
