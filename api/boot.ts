import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { appRouter } from './routers'; 
import { fetchHTTPResponse } from '@trpc/server'; // <--- ESTA es la función correcta en v11

const app = new Hono();

// 1. CORS para permitir peticiones del frontend
app.use('/api/*', cors());

// 2. Manejador de tRPC usando la respuesta HTTP estándar
app.all('/api/trpc/*', async (c) => {
  // tRPC v11 procesa la petición directamente usando fetchHTTPResponse
  return await fetchHTTPResponse(appRouter, {
    request: c.req.raw,
    ctx: {}, // Contexto vacío, puedes añadirlo luego
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
  .then(({ port }) => {
    console.log(`✅ Server is listening on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
