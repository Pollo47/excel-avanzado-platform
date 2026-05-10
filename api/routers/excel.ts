import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { getDb } from '../queries/connection';
import { excelUserProgress } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.APP_SECRET || 'supersecretkeychangeinproduction';

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

export const excelRouter = router({
  getUserProgress: publicProcedure.query(async ({ ctx }) => {
    const userId = getUserId(ctx);
    if (!userId) return [];
    const db = getDb();
    return db.select().from(excelUserProgress).where(eq(excelUserProgress.userId, userId));
  }),

  completeModule: publicProcedure
    .input(z.object({ moduleId: z.number().min(1).max(7) }))
    .mutation(async ({ input, ctx }) => {
      const userId = getUserId(ctx);
      if (!userId) throw new Error('No autorizado');

      const db = getDb();
      const [existing] = await db
        .select()
        .from(excelUserProgress)
        .where(and(
          eq(excelUserProgress.userId, userId),
          eq(excelUserProgress.moduleId, input.moduleId)
        ));

      if (existing) {
        await db
          .update(excelUserProgress)
          .set({ percentage: 100, completedAt: new Date() })
          .where(eq(excelUserProgress.id, existing.id));
      } else {
        await db.insert(excelUserProgress).values({
          userId,
          moduleId: input.moduleId,
          percentage: 100,
          completedAt: new Date(),
        });
      }

      return { success: true };
    }),
});
