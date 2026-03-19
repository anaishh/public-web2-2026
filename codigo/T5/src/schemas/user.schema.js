import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ID no válido');

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'El nombre es requerido' })
      .min(2, 'Mínimo 2 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    email: z
      .string({ required_error: 'El email es requerido' })
      .email('Email no válido'),
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .min(8, 'Mínimo 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Debe contener mayúsculas, minúsculas y números'
      ),
    role: z.enum(['user', 'admin']).optional().default('user'),
    avatar: z.string().url('URL no válida').optional().nullable()
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    role: z.enum(['user', 'admin']).optional(),
    isActive: z.boolean().optional(),
    avatar: z.string().url().optional().nullable()
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Debe proporcionar al menos un campo' }
  )
});

export const getUserSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});
