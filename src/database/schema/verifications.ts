import { AvailablePlatforms, AvailableVerifications } from '@/constants/auth';
import { timestamps } from '@/utils/timestamps-helper';
import { relations } from 'drizzle-orm';
import { index, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const verificationTypeEnum = pgEnum(
  'verification_type',
  AvailableVerifications as [string, ...string[]]
);

export const platformEnum = pgEnum('platform', AvailablePlatforms as [string, ...string[]]);

export const verifications = pgTable(
  'verifications',
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    type: verificationTypeEnum('type').notNull(),
    platform: platformEnum('platform').notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    ...timestamps,
  },
  (t) => [index('user_type_platform_idx').on(t.userId, t.type, t.platform)]
);

export const verificationsRelations = relations(verifications, ({ one }) => ({
  user: one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
}));

export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = typeof verifications.$inferInsert;
