/**
 * Maneja errores HTTP de forma consistente
 */
export const handleHttpError = (res, message = 'Error interno', code = 500) => {
  res.status(code).json({
    error: true,
    message
  });
};

/**
 * Wrapper para funciones async
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Clase de error personalizada
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}

/**
 * Errores predefinidos
 */
export const errors = {
  notFound: (resource = 'Recurso') => new AppError(`${resource} no encontrado`, 404),
  unauthorized: () => new AppError('No autorizado', 401),
  forbidden: () => new AppError('Acceso prohibido', 403),
  badRequest: (message = 'Solicitud inválida') => new AppError(message, 400),
  conflict: (message = 'Conflicto') => new AppError(message, 409)
};
