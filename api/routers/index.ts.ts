import { router } from '../middleware';
import { authRouter } from './auth';
import { adminRouter } from './admin';
import { excelRouter } from './excel';

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  excel: excelRouter,
});

export type AppRouter = typeof appRouter;