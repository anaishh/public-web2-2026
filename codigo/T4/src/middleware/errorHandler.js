/**
 * Middleware de manejo de errores
 */

import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
  
  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }
  
  static notFound(message = 'Recurso no encontrado') {
    return new ApiError(404, message);
  }
  
  static conflict(message, details) {
    return new ApiError(409, message, details);
  }
}

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { detalles: err.details })
    });
  }
  
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Error de validación',
      detalles: err.errors
    });
  }
  
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: 'Error interno del servidor',
    ...(isDev && { mensaje: err.message, stack: err.stack })
  });
};
