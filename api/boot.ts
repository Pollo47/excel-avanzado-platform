import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './routers';
import { readFile } from 'fs/promises';

const app = new Hono();

// 1. CORS
app.use('*', cors());

// 2. tRPC API (todas las rutas que empiezan con /api)
app.route('/api/trpc', trpcServer({
  router: appRouter,
  createContext: () => ({}),
}));

// 3. Health check
app.get('/health', (c) => c.text('OK'));

// 4. Servir archivos estáticos del frontend solo si no es API
app.get('*', async (c) => {
  // Si la ruta empieza con /api, no la manejamos aquí
  if (c.req.path.startsWith('/api')) {
    return c.text('API endpoint not found', 404);
  }
  
  try {
    // Intentar servir archivos estáticos desde dist
    const filePath = c.req.path === '/' ? '/index.html' : c.req.path;
    const file = await readFile(`./dist${filePath}`);
    const ext = filePath.split('.').pop();
    const contentType: Record<string, string> = {
      'js': 'text/javascript',
      'css': 'text/css',
      'html': 'text/html',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'svg': 'image/svg+xml',
    };
    return c.body(file, { headers: { 'Content-Type': contentType[ext] || 'text/plain' } });
  } catch (error) {
    // Si el archivo no existe, servir index.html para SPA
    try {
      const html = await readFile('./dist/index.html', 'utf-8');
      return c.html(html);
    } catch {
      return c.text('Frontend not built yet', 404);
    }
  }
});

const port = process.env.PORT || 10000;
console.log(`🚀 Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port: Number(port),
}, (info) => {
  console.log(`✅ Server listening on http://localhost:${info.port}`);
});
