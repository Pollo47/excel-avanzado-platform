import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { appRouter } from './routers'; // Importa tu router
import { fetchHandler } from '@trpc/server'; // Usamos el fetchHandler estándar de v11

// 1. Inicializamos la aplicación Hono
const app = new Hono();

// 2. Configuramos CORS
app.use('/api/*', cors());

// 3. Definimos la ruta de la API
app.all('/api/trpc/*', async (c) => {
  // En tRPC v11, usamos el fetchHandler que es compatible con Hono
  return await fetchHandler({
    opts: { 
      router: appRouter, 
      createContext: () => ({}) // Aquí puedes agregar el contexto de DB si lo necesitas
    },
    request: c.req.raw,
  });
});

// 4. Ruta de salud (Health Check)
app.get('/', (c) => {
  return c.text('Excel Academy API is running 🚀');
});

// 5. Arrancamos el servidor
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
