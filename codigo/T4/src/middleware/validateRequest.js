/**
 * Middleware de validación con Zod
 */

import { ZodError } from 'zod';

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errores = error.errors.map(err => ({
        campo: err.path.slice(1).join('.') || err.path[0],
        mensaje: err.message
      }));
      
      return res.status(400).json({
        error: 'Error de validación',
        detalles: errores
      });
    }
    next(error);
  }
};
