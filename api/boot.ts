import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './routers';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

const app = new Hono();

// CORS
app.use('*', cors());

// tRPC - IMPORTANTE: usar app.use con comodín
app.use('/api/trpc/*', trpcServer({
  router: appRouter,
  createContext: () => ({}),
}));

// Health check
app.get('/health', (c) => c.text('OK'));

// Servir frontend (solo si existe la carpeta dist)
app.get('/*', async (c) => {
  const path = c.req.path;
  
  // No interferir con API
  if (path.startsWith('/api')) {
    return c.text('API endpoint not found', 404);
  }
  
  try {
    // Intentar servir archivo estático
    const filePath = path === '/' ? '/index.html' : path;
    const fullPath = `./dist${filePath}`;
    
    if (existsSync(fullPath)) {
      const file = await readFile(fullPath);
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
      return c.body(file, { 
        headers: { 
          'Content-Type': contentType[ext || 'html'] || 'text/plain' 
        } 
      });
    }
    
    // Si no es archivo, servir index.html (SPA)
    const html = await readFile('./dist/index.html', 'utf-8');
    return c.html(html);
  } catch (error) {
    return c.text('Frontend not found', 404);
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
