import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../middleware';
import { getDb } from '../queries/connection';
import { users, accessKeys } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { createToken } from '../lib/jwt';
import { hash, compare } from 'bcryptjs';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), keyCode: z.string().length(8), name: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Buscar clave
      const [key] = await db.select().from(accessKeys).where(eq(accessKeys.keyCode, input.keyCode));
      if (!key) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Clave inválida' });
      if (key.used && key.type === 'individual') throw new TRPCError({ code: 'BAD_REQUEST', message: 'Clave ya utilizada' });
      if (key.expiresAt && new Date(key.expiresAt) < new Date()) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Clave expirada' });

      // Buscar usuario existente
      let [user] = await db.select().from(users).where(eq(users.email, input.email));
      if (user) {
        if (key.type === 'individual' && key.usedByUserId && key.usedByUserId !== user.id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Clave usada por otro usuario' });
      } else {
        if (!input.name) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Nombre requerido para registro' });
        const hashedPassword = await hash(input.keyCode, 10);
        const [newUser] = await db.insert(users).values({
          email: input.email,
          name: input.name,
          password: hashedPassword,
          role: 'user',
          isExcelAuthorized: false,
        }).$returningId();
        user = { id: Number(newUser.id), email: input.email, name: input.name, role: 'user', isExcelAuthorized: false, createdAt: new Date(), updatedAt: new Date() };
      }

      if (key.type === 'individual') {
        await db.update(accessKeys).set({ used: true, usedByUserId: user.id }).where(eq(accessKeys.id, key.id));
      }

      const token = await createToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isExcelAuthorized: user.isExcelAuthorized,
      });

      return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role, isExcelAuthorized: user.isExcelAuthorized } };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id));
    if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
    return { id: user.id, email: user.email, name: user.name, role: user.role, isExcelAuthorized: user.isExcelAuthorized };
  }),

  logout: protectedProcedure.mutation(() => ({ success: true })),
});