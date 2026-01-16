import { db } from '@/database/db';
import { users, type InsertUser, type User } from '@/database/schema';
import { SelectFields } from '@/types';
import { buildReturning, normalizeSelect } from '@/utils/repository-helpers';
import { eq } from 'drizzle-orm';

export class UserRepository {
  static async create(data: InsertUser, select?: SelectFields<User>) {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning(buildReturning<User>(users, select));
    return user as User;
  }

  static async findById(id: string, select?: SelectFields<User>) {
    return await db.query.users.findFirst({
      where: { id },
      columns: normalizeSelect(select),
    });
  }

  static async findByEmail(email: string, select?: SelectFields<User>) {
    return await db.query.users.findFirst({
      where: { email },
      columns: normalizeSelect(select),
    });
  }

  static async findByIdWithLocations(id: string, select?: SelectFields<User>) {
    return await db.query.users.findFirst({
      where: { id },
      columns: normalizeSelect(select),
      with: {
        locations: true,
      },
    });
  }

  static async findByEmailWithLocations(email: string, select?: SelectFields<User>) {
    return await db.query.users.findFirst({
      where: { email },
      columns: normalizeSelect(select),
      with: {
        locations: true,
      },
    });
  }

  static async update(id: string, data: Partial<InsertUser>, select?: SelectFields<User>) {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning(buildReturning(users, select));
    return updated as User;
  }

  static async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
