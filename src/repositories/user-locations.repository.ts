import { AvailableLocationTypes, LocationType } from '@/constants/auth';
import { db } from '@/database/db';
import { userLocations, type InsertUserLocation, type UserLocation } from '@/database/schema';
import { SelectFields } from '@/types';
import { buildReturning, normalizeSelect } from '@/utils/repository-helpers';
import { and, eq } from 'drizzle-orm';

export class UserLocationRepository {
  static async create(data: InsertUserLocation, select?: SelectFields<UserLocation>) {
    const [location] = await db
      .insert(userLocations)
      .values(data)
      .returning(buildReturning(userLocations, select));

    return location;
  }

  static async upsertLastLogin(
    userId: string,
    locationData: Omit<InsertUserLocation, 'userId' | 'type'>
  ) {
    return await db.transaction(async (trx) => {
      const existing = await trx.query.userLocations.findFirst({
        where: and(
          eq(userLocations.userId, userId),
          eq(userLocations.type, LocationType.LAST_LOGIN)
        ),
      });

      if (existing) {
        const [updated] = await trx
          .update(userLocations)
          .set({ ...locationData, updatedAt: new Date() })
          .where(eq(userLocations.id, existing.id))
          .returning();

        return updated;
      } else {
        const [created] = await trx
          .insert(userLocations)
          .values({
            userId,
            type: LocationType.LAST_LOGIN,
            ...locationData,
          })
          .returning();

        return created;
      }
    });
  }

  static async findByUserId(userId: string, select?: SelectFields<UserLocation>) {
    return await db.query.userLocations.findMany({
      where: eq(userLocations.userId, userId),
      columns: normalizeSelect(select),
    });
  }

  static async findByUserIdAndType(
    userId: string,
    type: (typeof AvailableLocationTypes)[number],
    select?: SelectFields<UserLocation>
  ) {
    return await db.query.userLocations.findFirst({
      where: and(eq(userLocations.userId, userId), eq(userLocations.type, type)),
      columns: normalizeSelect(select),
    });
  }

  static async deleteByUserId(userId: string): Promise<void> {
    await db.delete(userLocations).where(eq(userLocations.userId, userId));
  }
}
