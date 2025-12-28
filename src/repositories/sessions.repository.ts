import { db } from '@/database/db';
import { sessions, type InsertSession, type Session } from '@/database/schema';
import { SelectFields } from '@/types';
import { buildReturning, normalizeSelect } from '@/utils/repository-helpers';
import { and, eq, lt, sql } from 'drizzle-orm';

export class SessionRepository {
  static async create(data: InsertSession, select?: SelectFields<Session>): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(data)
      .returning(buildReturning(sessions, select));

    return session as Session;
  }

  static async findByRefreshToken(refreshToken: string, select?: SelectFields<Session>) {
    return await db.query.sessions.findFirst({
      where: eq(sessions.refreshToken, refreshToken),
      columns: normalizeSelect(select),
    });
  }

  static async findByUserId(userId: string, select?: SelectFields<Session>) {
    return await db.query.sessions.findMany({
      where: eq(sessions.userId, userId),
      columns: normalizeSelect(select),
      orderBy: (sessions, { desc }) => [desc(sessions.createdAt)],
    });
  }

  static async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.refreshToken, refreshToken));
  }

  static async deleteByUserId(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }

  static async deleteByUserIdExceptCurrent(
    userId: string,
    currentRefreshToken: string
  ): Promise<void> {
    await db
      .delete(sessions)
      .where(
        and(eq(sessions.userId, userId), sql`${sessions.refreshToken} != ${currentRefreshToken}`)
      );
  }

  static async deleteExpired(): Promise<void> {
    await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  }
}
