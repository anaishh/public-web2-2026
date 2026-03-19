import { z } from 'zod';
import { objectIdSchema, paginationSchema } from './common.schema.js';

// Crear track
export const createTrackSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'El título es requerido' })
      .min(1, 'El título no puede estar vacío')
      .max(200, 'Máximo 200 caracteres')
      .trim(),
    duration: z
      .number({ required_error: 'La duración es requerida' })
      .int('Debe ser un número entero')
      .min(1, 'Mínimo 1 segundo')
      .max(36000, 'Máximo 10 horas'),
    genres: z
      .array(z.string().trim())
      .min(1, 'Debe tener al menos un género')
      .max(5, 'Máximo 5 géneros'),
    collaborators: z.array(objectIdSchema).optional().default([]),
    isPublic: z.boolean().optional().default(true)
  })
});

// Actualizar track
export const updateTrackSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    title: z.string().min(1).max(200).trim().optional(),
    duration: z.number().int().min(1).max(36000).optional(),
    genres: z.array(z.string().trim()).min(1).max(5).optional(),
    collaborators: z.array(objectIdSchema).optional(),
    isPublic: z.boolean().optional()
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Debe enviar al menos un campo' }
  )
});

// Listar tracks
export const listTracksSchema = z.object({
  query: paginationSchema.extend({
    genre: z.string().optional(),
    artist: objectIdSchema.optional(),
    isPublic: z.enum(['true', 'false']).transform(v => v === 'true').optional()
  })
});

// ID de track
export const trackIdSchema = z.object({
  params: z.object({ id: objectIdSchema })
});
