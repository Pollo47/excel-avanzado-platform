import { router } from '../trpc';
import { authRouter } from './auth';
import { excelRouter } from './excel';
import { adminRouter } from './admin';

export const appRouter = router({
  auth: authRouter,
  excel: excelRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
