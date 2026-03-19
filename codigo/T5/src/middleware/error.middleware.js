import mongoose from 'mongoose';

/**
 * Middleware para rutas no encontradas
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    error: true,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

/**
 * Middleware global de errores
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  // Error de validación de Mongoose
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: true,
      message: 'Error de validación',
      details: messages
    });
  }
  
  // Error de Cast (ID inválido)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: true,
      message: `Valor inválido para '${err.path}'`
    });
  }
  
  // Error de duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    return res.status(409).json({
      error: true,
      message: `Ya existe un registro con ese '${field}'`
    });
  }
  
  // Error de Multer - tamaño
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: true,
      message: 'El archivo excede el tamaño máximo (10MB)'
    });
  }
  
  // Error de Multer - cantidad
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      error: true,
      message: 'Se excedió el número máximo de archivos'
    });
  }
  
  // Error de Zod
  if (err.name === 'ZodError') {
    const errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return res.status(400).json({
      error: true,
      message: 'Error de validación',
      details: errors
    });
  }
  
  // Error genérico
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor'
  });
};
