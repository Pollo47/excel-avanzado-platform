import { z } from 'zod';
import { router, protectedProcedure } from '../middleware';
import { getDb } from '../queries/connection';
import { users, accessKeys, excelUserProgress } from '../../db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const adminRouter = router({
  getStats: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    return next();
  }).query(async () => {
    const db = getDb();
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalKeys = await db.select({ count: sql<number>`count(*)` }).from(accessKeys);
    const usedKeys = await db.select({ count: sql<number>`count(*)` }).from(accessKeys).where(eq(accessKeys.used, true));
    const activeUsers = await db.select({ count: sql<number>`count(distinct ${users.id})` }).from(users).innerJoin(excelUserProgress, eq(users.id, excelUserProgress.userId));
    return { totalUsers: totalUsers[0]?.count || 0, totalKeys: totalKeys[0]?.count || 0, usedKeys: usedKeys[0]?.count || 0, activeUsers: activeUsers[0]?.count || 0 };
  }),

  getKeys: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    return next();
  }).query(async () => {
    const db = getDb();
    return await db.select().from(accessKeys).orderBy(desc(accessKeys.createdAt));
  }),

  generateKey: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    return next();
  }).input(z.object({ entityName: z.string(), emailDomain: z.string().optional() })).mutation(async ({ input }) => {
    const db = getDb();
    const keyCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const [result] = await db.insert(accessKeys).values({
      keyCode,
      type: input.emailDomain ? 'group' : 'individual',
      entityName: input.entityName,
      emailDomain: input.emailDomain,
      used: false,
    }).$returningId();
    return { success: true, key: keyCode, id: Number(result.id) };
  }),

  deleteKey: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    return next();
  }).input(z.object({ keyId: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(accessKeys).where(eq(accessKeys.id, input.keyId));
    return { success: true };
  }),

  resetKey: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    return next();
  }).input(z.object({ keyId: z.number() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.update(accessKeys).set({ used: false, usedByUserId: null }).where(eq(accessKeys.id, input.keyId));
    return { success: true };
  }),

  getUsers: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    return next();
  }).query(async () => {
    const db = getDb();
    return await db.select({ id: users.id, email: users.email, name: users.name, role: users.role, isExcelAuthorized: users.isExcelAuthorized, createdAt: users.createdAt }).from(users);
  }),

  toggleExcelAuthorization: protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    return next();
  }).input(z.object({ userId: z.number(), authorized: z.boolean() })).mutation(async ({ input }) => {
    const db = getDb();
    await db.update(users).set({ isExcelAuthorized: input.authorized }).where(eq(users.id, input.userId));
    return { success: true };
  }),
});