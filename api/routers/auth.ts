import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { getDb } from '../queries/connection';
import { users, accessKeys } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.APP_SECRET || 'supersecretkeychangeinproduction';

export const authRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const db = getDb();
      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
      return user || null;
    } catch {
      return null;
    }
  }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      keyCode: z.string().min(4).max(8),
      name: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Find key
      const [key] = await db.select().from(accessKeys).where(eq(accessKeys.keyCode, input.keyCode.toUpperCase()));
      if (!key) {
        return { success: false, message: 'Clave de acceso no válida' };
      }
      if (key.used) {
        return { success: false, message: 'Esta clave ya fue utilizada' };
      }

      // Check if user exists
      let [user] = await db.select().from(users).where(eq(users.email, input.email));

      if (!user) {
        if (!input.name) {
          return { success: false, message: 'Necesitas registrarte. Ingresa tu nombre.' };
        }
        // Create user
        const hashedPassword = await bcrypt.hash(input.keyCode, 10);
        const result = await db.insert(users).values({
          email: input.email,
          name: input.name,
          password: hashedPassword,
          role: 'user',
          isExcelAuthorized: true,
        });
        const userId = Number(result[0].insertId);
        [user] = await db.select().from(users).where(eq(users.id, userId));
      }

      // Mark key as used
      await db.update(accessKeys).set({ used: true, usedByUserId: user.id }).where(eq(accessKeys.id, key.id));

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return { success: true, token, user };
    }),

  logout: publicProcedure.mutation(async () => {
    return { success: true };
  }),
});
