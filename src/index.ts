import app from './app';
import { env } from './env';

const server = app.listen(env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${env.PORT} in ${env.NODE_ENV.toUpperCase()} mode`
  );
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received: closing server...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
export default app;
