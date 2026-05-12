import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './routers';
import { readFile } from 'fs/promises';

const app = new Hono();

// CORS
app.use('/api/*', cors());

// tRPC
app.use('/api/trpc/*', trpcServer({
  router: appRouter,
  createContext: () => ({}),
}));

// Servir frontend (versión manual)
app.get('/*', async (c) => {
  try {
    // Si es un archivo estático (JS, CSS, etc.)
    if (c.req.path.includes('.')) {
      const file = await readFile(`./dist${c.req.path}`);
      const ext = c.req.path.split('.').pop();
      const contentType = {
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

// Health check
app.get('/health', (c) => c.text('OK'));

const port = process.env.PORT || 10000;
console.log(`🚀 Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port: Number(port),
}, (info) => {
  console.log(`✅ Server listening on http://localhost:${info.port}`);
});
