import { db } from '@/database/db';
import { verifications, type InsertVerification, type Verification } from '@/database/schema';
import { SelectFields } from '@/types';
import { buildReturning, normalizeSelect } from '@/utils/repository-helpers';
import { and, eq } from 'drizzle-orm';

export class VerificationRepository {
  static async create(data: InsertVerification, select?: SelectFields<Verification>) {
    const [verification] = await db
      .insert(verifications)
      .values(data)
      .returning(buildReturning(verifications, select));

    return verification as Verification;
  }

  static async createVerification(
    userId: string,
    type: string,
    platform: string,
    token: string,
    expiresAt: Date
  ) {
    return await db.transaction(async (trx) => {
      await trx
        .delete(verifications)
        .where(
          and(
            eq(verifications.userId, userId),
            eq(verifications.type, type as any),
            eq(verifications.platform, platform as any)
          )
        );

      const [verification] = await trx
        .insert(verifications)
        .values({
          userId,
          type: type as any,
          platform: platform as any,
          token,
          expiresAt,
        })
        .returning();

      return verification;
    });
  }

  static async findByToken(token: string, select?: SelectFields<Verification>) {
    return await db.query.verifications.findFirst({
      where: eq(verifications.token, token),
      columns: normalizeSelect(select),
    });
  }

  static async findByUserId(userId: string, select?: SelectFields<Verification>) {
    return await db.query.verifications.findMany({
      where: eq(verifications.userId, userId),
      columns: normalizeSelect(select),
    });
  }

  static async findByUserAndType(
    userId: string,
    type: string,
    select?: SelectFields<Verification>
  ) {
    return await db.query.verifications.findFirst({
      where: and(eq(verifications.userId, userId), eq(verifications.type, type)),
      columns: normalizeSelect(select),
    });
  }

  static async findByUserTypePlatform(
    userId: string,
    type: string,
    platform: string,
    select?: SelectFields<Verification>
  ) {
    return await db.query.verifications.findFirst({
      where: and(
        eq(verifications.userId, userId),
        eq(verifications.type, type),
        eq(verifications.platform, platform)
      ),
      columns: normalizeSelect(select),
    });
  }

  static async deleteByToken(token: string): Promise<void> {
    await db.delete(verifications).where(eq(verifications.token, token));
  }

  static async deleteByUserId(userId: string): Promise<void> {
    await db.delete(verifications).where(eq(verifications.userId, userId));
  }
  static async deleteAllByUserId(userId: string) {
    await db.delete(verifications).where(eq(verifications.userId, userId));
  }

  static async deleteByUserAndType(userId: string, type: string): Promise<void> {
    await db
      .delete(verifications)
      .where(and(eq(verifications.userId, userId), eq(verifications.type, type)));
  }
}
