import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { appRouter } from './routers'; 
// CAMBIO AQUÍ: Importamos desde la subcarpeta /adapters/fetch
import { fetchHandler } from '@trpc/server/adapters/fetch'; 

const app = new Hono();

// 1. CORS
app.use('/api/*', cors());

// 2. Manejador de la API
app.all('/api/trpc/*', async (c) => {
  return await fetchHandler({
    opts: { 
      router: appRouter, 
      createContext: () => ({}) 
    },
    request: c.req.raw,
  });
});

// 3. Health Check
app.get('/', (c) => {
  return c.text('Excel Academy API is running 🚀');
});

// 4. Servidor
const port = process.env.PORT || 10000;
console.log(`🚀 Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port: Number(port),
})
  .then(({ port }) => {
    console.log(`✅ Server is listening on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
