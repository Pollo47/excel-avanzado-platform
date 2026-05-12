import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

// 1. Middlewares básicos (SIEMPRE PRIMERO)
app.use(cors());
app.use(express.json());

// 2. Rutas de API y Salud (Siguen después de los middlewares)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const createContext = async ({ req, res }: any) => {
  return {
    req,
    res,
    token: req.headers.authorization?.split(' ')[1] || null,
  };
};

app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

// 3. Archivos estáticos (SÓLO si no coincidió con las rutas de arriba)
app.use(express.static(path.join(__dirname, '../dist')));

// 4. El "Atrapa-todo" (SIEMPRE AL FINAL)
// Esto sirve el index.html para que React Router maneje las rutas internas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
