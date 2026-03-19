import { z } from 'zod';

// ObjectId
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ID no válido');

// Paginación
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
});

// Email
export const emailSchema = z
  .string()
  .email('Email no válido')
  .toLowerCase()
  .trim();

// Password seguro
export const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener mayúscula')
  .regex(/[a-z]/, 'Debe contener minúscula')
  .regex(/[0-9]/, 'Debe contener número');
