import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ID no válido');

export const createTrackSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'El título es requerido' })
      .min(1, 'El título no puede estar vacío')
      .max(200, 'Máximo 200 caracteres'),
    artist: objectIdSchema,
    collaborators: z.array(objectIdSchema).optional().default([]),
    duration: z
      .number({ required_error: 'La duración es requerida' })
      .int('Debe ser un número entero')
      .min(1, 'Mínimo 1 segundo')
      .max(36000, 'Máximo 10 horas'),
    genres: z
      .array(z.string())
      .min(1, 'Debe tener al menos un género')
      .max(5, 'Máximo 5 géneros'),
    isPublic: z.boolean().optional().default(true)
  })
});

export const updateTrackSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    collaborators: z.array(objectIdSchema).optional(),
    duration: z.number().int().min(1).max(36000).optional(),
    genres: z.array(z.string()).min(1).max(5).optional(),
    isPublic: z.boolean().optional()
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Debe proporcionar al menos un campo' }
  )
});

export const getTrackSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});
