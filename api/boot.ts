import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { appRouter } from './routers';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const app = new Hono();

// 1. CORS para permitir peticiones del frontend
app.use('/api/*', cors());

// 2. Manejador de tRPC manual
app.all('/api/trpc/*', async (c) => {
  const res = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}),
  });
  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
});

// 3. Health Check
app.get('/', (c) => {
  return c.text('Excel Academy API is running 🚀');
});

// 4. Arranque del servidor
const port = process.env.PORT || 10000;
console.log(`🚀 Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port: Number(port),
})
  .then(() => {  // @hono/node-server no devuelve el puerto en .then
    console.log(`✅ Server is listening on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
