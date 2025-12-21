import app from './app';
import { env } from './env';
import logger from './utils/logger';

const server = app.listen(env.PORT, () => {
  logger.info(
    `Server is running on http://localhost:${env.PORT} in ${env.NODE_ENV.toUpperCase()} mode`
  );
});

const shutdown = (signal: string) => {
  logger.warn(`\n${signal} received: closing server...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
export default app;
