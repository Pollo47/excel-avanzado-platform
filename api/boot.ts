import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './routers';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'; // Cambiado a @trpc/client

const app = new Hono();

// 1. CORS para permitir peticiones del frontend
app.use('/api/*', cors());

// 2. Manejador de tRPC usando el middleware oficial de Hono
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: () => ({}), // Contexto vacío, puedes añadirlo luego
  })
);

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
  .then((server) => {  // Cambiado: server en lugar de { port }
    console.log(`✅ Server is listening on http://localhost:${server.port}`);
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
