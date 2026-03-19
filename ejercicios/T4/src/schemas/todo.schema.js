/**
 * T4: Schemas de validación con Zod
 */

import { z } from 'zod';

// Schema base para todo
const todoBase = {
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres')
    .trim(),

  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),

  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Prioridad debe ser: low, medium o high' })
  }).default('medium'),

  completed: z.boolean().default(false),

  dueDate: z.string()
    .transform(val => new Date(val))
    .refine(date => !isNaN(date.getTime()), 'Fecha no válida')
    .refine(date => date > new Date(), 'La fecha debe ser futura')
    .optional(),

  tags: z.array(z.string().min(1).max(20))
    .max(5, 'Máximo 5 tags permitidos')
    .default([])
};

// Schema para crear todo
export const createTodoSchema = z.object({
  body: z.object({
    title: todoBase.title,
    description: todoBase.description,
    priority: todoBase.priority,
    dueDate: todoBase.dueDate,
    tags: todoBase.tags
  })
});

// Schema para actualizar todo (todos los campos opcionales)
export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID debe ser un UUID válido')
  }),
  body: z.object({
    title: todoBase.title.optional(),
    description: todoBase.description,
    priority: z.enum(['low', 'medium', 'high']).optional(),
    completed: z.boolean().optional(),
    dueDate: todoBase.dueDate,
    tags: todoBase.tags.optional()
  }).refine(
    data => Object.keys(data).length > 0,
    'Debe enviar al menos un campo para actualizar'
  )
});

// Schema para query params
export const listTodosSchema = z.object({
  query: z.object({
    completed: z.enum(['true', 'false']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title']).optional(),
    order: z.enum(['asc', 'desc']).default('desc')
  })
});

// Schema para ID en params
export const todoIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID debe ser un UUID válido')
  })
});
