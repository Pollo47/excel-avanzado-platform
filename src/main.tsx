import React from 'react';
import ReactDOM from 'react-dom/client';
import { TRPCProvider } from './providers/trpc';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TRPCProvider>
      <RouterProvider router={router} />
    </TRPCProvider>
  </React.StrictMode>
);