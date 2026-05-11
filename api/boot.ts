import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@trpc/server';
import { createTRPCRouter } from '@trpc/server';
import { appRouter } from './routers'; // Importa el router principal de tu carpeta routers

// 1. Inicializamos la aplicación Hono
const app = new Hono();

// 2. Configuramos CORS para que el frontend pueda comunicarse con el backend
app.use('/api/*', cors({
  origin: '*', // En producción podrías poner la URL de tu web de Render
}));

// 3. Creamos el manejador de tRPC
const trpcMiddleware = trpcServer.middleware();

// 4. Definimos el endpoint de la API
app.use(
  '/api/trpc/*',
  async (c) => {
    const path = c.req.path.replace('/api/trpc', '');
    return trpcMiddleware.handle(appRouter, c);
  }
);

// 5. Ruta de salud (Health Check) para que Render sepa que el servidor está vivo
app.get('/', (c) => {
  return c.text('Excel Academy API is running 🚀');
});

// 6. Arrancamos el servidor en el puerto que Render nos asigne
const port = process.env.PORT || 10000;
console.log(`🚀 Server started on port ${port}`);

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
