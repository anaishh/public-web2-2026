import mongoose from 'mongoose';

/**
 * Middleware de validación con Zod
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    const errors = error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    
    res.status(400).json({
      error: true,
      message: 'Error de validación',
      details: errors
    });
  }
};

/**
 * Middleware para validar solo body
 */
export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    
    res.status(400).json({
      error: true,
      message: 'Error de validación',
      details: errors
    });
  }
};

/**
 * Middleware para validar ObjectId
 */
export const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: true,
      message: `'${paramName}' no es un ID válido`
    });
  }
  
  next();
};
