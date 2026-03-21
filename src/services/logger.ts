import pino, { Logger } from 'pino';

const logLevel = process.env.LOG_LEVEL || 'info';
const isDevelopment = process.env.NODE_ENV !== 'production';

const transport = isDevelopment
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'SYS:standard',
      },
    }
  : undefined;

export const logger: Logger = pino({
  level: logLevel,
  transport,
});

export const createChildLogger = (context: string): Logger => {
  return logger.child({ context });
};

export default logger;
