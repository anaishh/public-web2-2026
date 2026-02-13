/**
 * Schemas de validación con Zod
 */

import { z } from 'zod';

const lenguajes = ['javascript', 'python', 'java', 'csharp', 'go', 'rust'];
const niveles = ['basico', 'intermedio', 'avanzado'];

export const createCursoSchema = z.object({
  body: z.object({
    titulo: z.string().min(3).max(100).trim(),
    lenguaje: z.enum(lenguajes),
    nivel: z.enum(niveles),
    descripcion: z.string().max(500).optional()
  })
});

export const updateCursoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID debe ser numérico')
  }),
  body: z.object({
    titulo: z.string().min(3).max(100).trim(),
    lenguaje: z.enum(lenguajes),
    nivel: z.enum(niveles),
    descripcion: z.string().max(500).optional()
  })
});

export const patchCursoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID debe ser numérico')
  }),
  body: z.object({
    titulo: z.string().min(3).max(100).trim().optional(),
    lenguaje: z.enum(lenguajes).optional(),
    nivel: z.enum(niveles).optional(),
    vistas: z.number().int().nonnegative().optional(),
    descripcion: z.string().max(500).optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo'
  })
});

export const getCursoByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID debe ser numérico')
  })
});
