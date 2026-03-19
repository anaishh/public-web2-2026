/**
 * T6: Clase de Error Personalizada
 *
 * Conceptos aplicados:
 * - Herencia de Error
 * - Factory methods
 * - Error operacional vs programático
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Distingue de errores de programación

    Error.captureStackTrace(this, this.constructor);
  }

  // ========================================
  // Factory Methods
  // ========================================

  static badRequest(message = 'Solicitud inválida', code = 'BAD_REQUEST') {
    return new AppError(message, 400, code);
  }

  static unauthorized(message = 'No autorizado', code = 'UNAUTHORIZED') {
    return new AppError(message, 401, code);
  }

  static forbidden(message = 'Acceso prohibido', code = 'FORBIDDEN') {
    return new AppError(message, 403, code);
  }

  static notFound(resource = 'Recurso', code = 'NOT_FOUND') {
    return new AppError(`${resource} no encontrado`, 404, code);
  }

  static conflict(message = 'Conflicto con recurso existente', code = 'CONFLICT') {
    return new AppError(message, 409, code);
  }

  static validation(message = 'Error de validación', details = []) {
    const error = new AppError(message, 400, 'VALIDATION_ERROR');
    error.details = details;
    return error;
  }

  static tooManyRequests(message = 'Demasiadas peticiones', code = 'RATE_LIMIT') {
    return new AppError(message, 429, code);
  }

  static internal(message = 'Error interno del servidor', code = 'INTERNAL_ERROR') {
    return new AppError(message, 500, code);
  }

  // Serializar para respuesta JSON
  toJSON() {
    return {
      error: true,
      message: this.message,
      code: this.code,
      ...(this.details && { details: this.details })
    };
  }
}
