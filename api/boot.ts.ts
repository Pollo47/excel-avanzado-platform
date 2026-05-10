import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { serve } from '@hono/node-server';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './routers';
import { createContext } from './context';
import { env } from './lib/env';

const app = new Hono();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.use('/api/trpc/*', trpcServer({ router: appRouter, createContext }));

app.get('/api/ping', (c) => c.json({ pong: true }));

// Servir archivos estáticos del frontend (build)
import { serveStatic } from '@hono/node-server/serve-static';
app.use('*', serveStatic({ root: './dist/public' }));
app.get('*', async (c) => {
  const html = await Bun.file('./dist/public/index.html').text();
  return c.html(html);
});

const port = env.port;
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}/`);
});