import { AuthProviderType, AvailableAuthProviders, AvailableUserRoles } from '@/constants/auth';
import { timestamps } from '@/utils/timestamps-helper';
import { relations } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { verifications } from './verifications';
import { userLocations } from './user-locations';

export const authProviderEnum = pgEnum(
  'auth_provider',
  AvailableAuthProviders as [string, ...string[]]
);

export const userRoleEnum = pgEnum('user_role', AvailableUserRoles as [string, ...string[]]);

export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    password: varchar('password', { length: 60 }),
    providerId: varchar('provider_id', { length: 255 }),
    provider: authProviderEnum('provider').default(AuthProviderType.CUSTOM).notNull(),
    role: userRoleEnum('role').default('user').notNull(),
    isVerified: boolean('is_verified').default(false).notNull(),
    profileCompleted: boolean('profile_completed').default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('email_idx').on(table.email),
    uniqueIndex('provider_user_idx').on(table.provider, table.providerId),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  verifications: many(verifications),
  locations: many(userLocations),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
