/**
 * T6: Middleware de Errores
 */

import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

/**
 * Middleware para rutas no encontradas
 */
export const notFound = (req, res, next) => {
  next(AppError.notFound(`Ruta ${req.method} ${req.originalUrl}`));
};

/**
 * Middleware global de errores
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Error operacional (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Error de validación de Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      error: true,
      message: 'Error de validación',
      code: 'VALIDATION_ERROR',
      details
    });
  }

  // Error de Cast (ID inválido de MongoDB)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: true,
      message: `Valor inválido para '${err.path}': ${err.value}`,
      code: 'CAST_ERROR'
    });
  }

  // Error de duplicado (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({
      error: true,
      message: `Ya existe un registro con ese '${field}'`,
      code: 'DUPLICATE_KEY'
    });
  }

  // Error de Zod
  if (err.name === 'ZodError') {
    const details = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));

    return res.status(400).json({
      error: true,
      message: 'Error de validación',
      code: 'VALIDATION_ERROR',
      details
    });
  }

  // Error no controlado
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(500).json({
    error: true,
    message: isProduction ? 'Error interno del servidor' : err.message,
    code: 'INTERNAL_ERROR',
    ...(!isProduction && { stack: err.stack })
  });
};
