import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { appRouter } from './routers'; // Importa el router principal
import { createHTTPRequestHandler } from '@trpc/server/adapters/node';

// 1. Inicializamos la aplicación Hono
const app = new Hono();

// 2. Configuramos CORS
app.use('/api/*', cors());

// 3. Creamos la función que maneja las peticiones de tRPC
// En v11, usamos el adaptador de Node para procesar las rutas
const handler = createHTTPRequestHandler({
  router: appRouter,
  buildContext: () => ({}), // Aquí puedes agregar el contexto de usuario/db más adelante
});

// 4. Definimos la ruta de la API
app.all('/api/trpc/*', async (c) => {
  // Convertimos la petición de Hono al formato que tRPC entiende
  const req = c.req.raw;
  const res = await handler(req);
  return res;
});

// 5. Ruta de salud (Health Check)
app.get('/', (c) => {
  return c.text('Excel Academy API is running 🚀');
});

// 6. Arrancamos el servidor
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
