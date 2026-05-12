import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './routers';
import { readFile } from 'fs/promises';
import { join } from 'path';

const app = new Hono();

// 1. CORS para permitir peticiones del frontend
app.use('/api/*', cors());

// 2. Manejador de tRPC usando el middleware oficial de Hono
app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: () => ({}),
  })
);

// 3. Servir archivos estáticos del frontend (¡NUEVO!)
app.use('/*', serveStatic({
  root: './dist',
  path: (c) => {
    // Si la ruta no tiene extensión, asumimos que es una ruta de React Router
    if (!c.req.path.includes('.')) {
      return 'index.html';
    }
    return c.req.path;
  }
}));

// 4. Health Check
app.get('/', (c) => {
  return c.text('Excel Academy API is running 🚀');
});

// 5. Arranque del servidor
const port = process.env.PORT || 10000;

console.log(`🚀 Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port: Number(port),
}, (info) => {
  console.log(`✅ Server is listening on http://localhost:${info.port}`);
});
