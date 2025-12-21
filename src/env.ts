import { z } from 'zod';
import 'dotenv-flow/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(4001),
  DATABASE_URL: z.string().nonempty(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('http'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.log('Environment variables validation failed: ', parsedEnv.error.issues);
  throw new Error('There is an error with the environment variables. ');
}

export const env = parsedEnv.data;

export type ENV = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    // @ts-ignore
    interface ProcessEnv extends ENV {}
  }
}
