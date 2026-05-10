import { inferAsyncReturnType } from '@trpc/server';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { verifyJWT } from './lib/jwt';
import { getDb } from './queries/connection';

export async function createContext({ req }: CreateHTTPContextOptions) {
  let user = null;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      user = await verifyJWT(token);
    } catch (err) {
      console.error('JWT verification failed', err);
    }
  }
  return { db: getDb(), user };
}

export type Context = inferAsyncReturnType<typeof createContext>;