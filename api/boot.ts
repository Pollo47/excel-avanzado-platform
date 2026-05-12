import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './routers';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

const app = new Hono();

// CORS
app.use('*', cors());

// Manejador manual de tRPC (más confiable que @hono/trpc-server)
app.all('/api/trpc/*', async (c) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}),
  });
  
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

// Health check
app.get('/health', (c) => c.text('OK'));

// Servir frontend
app.get('/*', async (c) => {
  const path = c.req.path;
  
  if (path.startsWith('/api')) {
    return c.text('API endpoint not found', 404);
  }
  
  try {
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
