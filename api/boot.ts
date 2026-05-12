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

// 1. Middlewares básicos
app.use(cors());
app.use(express.json());

// 2. Rutas de API y Salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * CORRECCIÓN MAESTRA: createContext
 * Aquí agregamos el "Polyfill" para que req.headers.get() funcione en Express.
 */
const createContext = async ({ req, res }: any) => {
  // ESTO ES LO QUE ARREGLA EL ERROR "headers.get is not a function"
  if (req.headers && typeof req.headers.get !== 'function') {
    req.headers.get = function (name: string) {
      const key = name.toLowerCase();
      return this[key] || null;
    };
  }

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

// 3. Archivos estáticos
app.use(express.static(path.join(__dirname, '../dist')));

// 4. Atrapa-todo
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
