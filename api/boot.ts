import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './routers';
import { readFile } from 'fs/promises';

const app = new Hono();

// 1. CORS (solo API)
app.use('/api/*', cors());

// 2. tRPC (DEBE IR ANTES del frontend)
app.use('/api/trpc/*', trpcServer({
  router: appRouter,
  createContext: () => ({}),
}));

// 3. Health check (también antes)
app.get('/health', (c) => c.text('OK'));

// 4. Servir frontend (SOLO para rutas que NO son API)
app.get('/*', async (c) => {
  // No interfieras con las rutas de API
  if (c.req.path.startsWith('/api')) {
    return c.text('Not found', 404);
  }
  
  try {
    // Si es un archivo estático (JS, CSS, etc.)
    if (c.req.path.includes('.')) {
      const file = await readFile(`./dist${c.req.path}`);
      const ext = c.req.path.split('.').pop();
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
    }
    
    // Para rutas de React Router, siempre servir index.html
    const html = await readFile('./dist/index.html', 'utf-8');
    return c.html(html);
  } catch (error) {
    return c.text('File not found', 404);
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
