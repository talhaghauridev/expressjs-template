import { z } from 'zod';
import 'dotenv-flow/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(4001),
  DATABASE_URL: z.string().nonempty(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('http'),
  CORS_ALLOWED_ORIGINS: z.string().default(' * '),
  ACCESS_TOKEN_SECRET: z.string().nonempty(),
  ACCESS_TOKEN_EXPIRE: z.string().default('10h'),
  REFRESH_TOKEN_EXPIRE: z.string().default('30d'),
  SMTP_SERVICE: z.string().nonempty().default('gmail'),
  SMTP_PASSWORD: z.string().nonempty(),
  SMTP_MAIL: z.string().nonempty(),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  APP_NAME: z.string().default('Template'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.log('Environment variables validation failed: ', parsedEnv.error.issues);
  throw new Error('There is an error with the environment variables. ');
}

export const env = {
  ...parsedEnv.data,
  isDev: parsedEnv.data.NODE_ENV === 'development',
  isProd: parsedEnv.data.NODE_ENV === 'production',
};

export type ENV = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    // @ts-ignore
    interface ProcessEnv extends ENV {}
  }
}
