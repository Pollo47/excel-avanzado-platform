import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../middleware';
import { getDb } from '../queries/connection';
import { excelModules, excelUnits, excelParagraphs, excelExercises, excelQuizQuestions, excelUserProgress, excelAccessRequests } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

const excelAuthorizedProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && !ctx.user.isExcelAuthorized) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'No tienes acceso al curso de Excel' });
  }
  return next();
});

export const excelRouter = router({
  moduleList: publicProcedure.query(async () => {
    const db = getDb();
    return await db.select({
      id: excelModules.id,
      title: excelModules.title,
      description: excelModules.description,
      coverImage: excelModules.coverImage,
      durationHours: excelModules.durationHours,
      order: excelModules.order,
    }).from(excelModules).orderBy(excelModules.order);
  }),

  getModuleById: excelAuthorizedProcedure.input(z.object({ moduleId: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const moduleData = await db.query.excelModules.findFirst({
      where: eq(excelModules.id, input.moduleId),
      with: {
        units: {
          orderBy: excelUnits.order,
          with: {
            paragraphs: { orderBy: excelParagraphs.order },
            exercises: { orderBy: excelExercises.order },
            quizQuestions: { orderBy: excelQuizQuestions.order },
          },
        },
      },
    });
    if (!moduleData) throw new TRPCError({ code: 'NOT_FOUND' });
    return moduleData;
  }),

  getUserProgress: excelAuthorizedProcedure.query(async ({ ctx }) => {
    const db = getDb();
    return await db.select().from(excelUserProgress).where(eq(excelUserProgress.userId, ctx.user.id));
  }),

  updateProgress: excelAuthorizedProcedure.input(z.object({ moduleId: z.number(), percentage: z.number().min(0).max(100) })).mutation(async ({ input, ctx }) => {
    const db = getDb();
    const existing = await db.select().from(excelUserProgress).where(and(eq(excelUserProgress.userId, ctx.user.id), eq(excelUserProgress.moduleId, input.moduleId))).then(rows => rows[0]);
    if (existing) {
      await db.update(excelUserProgress).set({ percentage: input.percentage, updatedAt: new Date() }).where(eq(excelUserProgress.id, existing.id));
    } else {
      await db.insert(excelUserProgress).values({ userId: ctx.user.id, moduleId: input.moduleId, percentage: input.percentage });
    }
    return { success: true };
  }),

  requestAccess: protectedProcedure.mutation(async ({ ctx }) => {
    const db = getDb();
    if (ctx.user.role === 'admin') throw new TRPCError({ code: 'BAD_REQUEST', message: 'Admin ya tiene acceso' });
    if (ctx.user.isExcelAuthorized) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Ya tienes acceso' });
    const existing = await db.select().from(excelAccessRequests).where(and(eq(excelAccessRequests.userId, ctx.user.id), eq(excelAccessRequests.status, 'pending'))).then(rows => rows[0]);
    if (existing) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Solicitud pendiente' });
    await db.insert(excelAccessRequests).values({ userId: ctx.user.id, status: 'pending' });
    return { success: true };
  }),
});