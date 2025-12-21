import { env } from '@/env';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize, json } = format;

const usePretty = env.NODE_ENV !== 'production' && process.stdout.isTTY;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const pretty = printf(
  ({ level, message, timestamp, ...meta }) =>
    `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
);

const logger = createLogger({
  levels,
  level: env.LOG_LEVEL,
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  transports: [
    new transports.Console({
      format: usePretty ? combine(colorize({ all: true }), pretty) : json(),
    }),
  ],
});

export default logger;
