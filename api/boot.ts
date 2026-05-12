import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

/**
 * CORRECCIÓN CRÍTICA: createContext
 * tRPC necesita el objeto req y res para poder leer los tokens de autenticación.
 * Si enviamos un objeto vacío {}, el servidor lanza Error 500 al intentar leer headers.
 */
const createContext = async ({ req, res }: any) => {
  return {
    req,
    res,
    // Extraemos el token aquí mismo para que sea más fácil de usar en los routers
    token: req.headers.authorization?.split(' ')[1] || null,
  };
};

// tRPC endpoint
app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext, // <--- Ahora pasamos la función corregida
}));

// Servir archivos estáticos del frontend (desde la carpeta dist)
// Asegúrate que la carpeta 'dist' esté en la raíz del proyecto
app.use(express.static(path.join(__dirname, '../dist')));

// Para rutas de React Router (SPA)
// Esto evita que al recargar la página en el navegador salga error 404
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Health check para que Render sepa que el servidor está vivo
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../dist')}`);
});
