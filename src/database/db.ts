import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { relations } from './schema/relations';

export const db = drizzle(env.DATABASE_URL, {
  schema,
  relations,
  logger: env.isDev,
});
