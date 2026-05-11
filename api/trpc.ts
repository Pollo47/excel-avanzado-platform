import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Inicializamos tRPC
export const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Aquí podrías agregar middleware de autenticación si lo necesitas más adelante
