import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router'; // Importamos el router único de router.tsx
import { TRPCProvider } from './providers/trpc';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TRPCProvider>
      <RouterProvider router={router} />
    </TRPCProvider>
  </React.StrictMode>
);
