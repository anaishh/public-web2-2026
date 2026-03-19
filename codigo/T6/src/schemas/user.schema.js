import { z } from 'zod';
import { objectIdSchema, emailSchema, paginationSchema } from './common.schema.js';

// Schema base (campos comunes)
const userBaseSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100).trim(),
  email: emailSchema,
  age: z.number().int().min(0).max(120).optional(),
  avatar: z.string().url('URL no válida').optional().nullable()
});

// Crear usuario
export const createUserSchema = z.object({
  body: userBaseSchema
});

// Actualizar usuario
export const updateUserSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: userBaseSchema.partial().extend({
    isActive: z.boolean().optional()
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Debe enviar al menos un campo' }
  )
});

// Listar usuarios
export const listUsersSchema = z.object({
  query: paginationSchema.extend({
    isActive: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
    search: z.string().max(100).optional()
  })
});

// Obtener/eliminar usuario por ID
export const userIdSchema = z.object({
  params: z.object({ id: objectIdSchema })
});
