import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { getDb } from '../queries/connection';
import { accessKeys, users, excelUserProgress } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.APP_SECRET || 'supersecretkeychangeinproduction';

function generateKeyCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

function getUserId(ctx: { req: { headers: { get: (name: string) => string | null } } }) {
  const token = ctx.req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

export const adminRouter = router({
  getAllKeys: publicProcedure.query(async ({ ctx }) => {
    const userId = getUserId(ctx);
    if (!userId) throw new Error('No autorizado');

    const db = getDb();
    const [adminUser] = await db.select().from(users).where(eq(users.id, userId));
    if (adminUser?.role !== 'admin') throw new Error('Solo administradores');

    return db.select().from(accessKeys).orderBy(desc(accessKeys.createdAt));
  }),

  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    const userId = getUserId(ctx);
    if (!userId) throw new Error('No autorizado');

    const db = getDb();
    const [adminUser] = await db.select().from(users).where(eq(users.id, userId));
    if (adminUser?.role !== 'admin') throw new Error('Solo administradores');

    return db.select().from(users).orderBy(desc(users.createdAt));
  }),

  createKeys: publicProcedure
    .input(z.object({
      type: z.enum(['individual', 'institucion']),
      quantity: z.number().min(1).max(100).default(1),
      institutionName: z.string().optional(),
      groupName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = getUserId(ctx);
      if (!userId) throw new Error('No autorizado');

      const db = getDb();
      const [adminUser] = await db.select().from(users).where(eq(users.id, userId));
      if (adminUser?.role !== 'admin') throw new Error('Solo administradores');

      const newKeys = [];
      for (let i = 0; i < input.quantity; i++) {
        let keyCode = generateKeyCode();
        // Ensure uniqueness
        let [existing] = await db.select().from(accessKeys).where(eq(accessKeys.keyCode, keyCode));
        while (existing) {
          keyCode = generateKeyCode();
          [existing] = await db.select().from(accessKeys).where(eq(accessKeys.keyCode, keyCode));
        }

        const result = await db.insert(accessKeys).values({
          keyCode,
          type: input.type,
          institutionName: input.institutionName || null,
          groupName: input.groupName || null,
          createdByAdminId: userId,
        });
        newKeys.push({ id: Number(result[0].insertId), keyCode, type: input.type, institutionName: input.institutionName, groupName: input.groupName, used: false });
      }

      return newKeys;
    }),

  deleteKey: publicProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const userId = getUserId(ctx);
      if (!userId) throw new Error('No autorizado');

      const db = getDb();
      const [adminUser] = await db.select().from(users).where(eq(users.id, userId));
      if (adminUser?.role !== 'admin') throw new Error('Solo administradores');

      await db.delete(accessKeys).where(eq(accessKeys.id, input));
      return { success: true };
    }),
});
