/**
 * T4: Middleware personalizados
 */

// Colores para el log
const colors = {
  GET: '\x1b[32m',    // Verde
  POST: '\x1b[33m',   // Amarillo
  PUT: '\x1b[34m',    // Azul
  PATCH: '\x1b[36m',  // Cyan
  DELETE: '\x1b[31m', // Rojo
  reset: '\x1b[0m'
};

/**
 * Middleware de logging con timestamps
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Cuando termine la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const color = colors[req.method] || '';
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';

    console.log(
      `${timestamp} | ${color}${req.method}${colors.reset} ${req.originalUrl} | ` +
      `${statusColor}${res.statusCode}${colors.reset} | ${duration}ms`
    );
  });

  next();
};

/**
 * BONUS: Rate limiting simple
 */
const requestCounts = new Map();

export const rateLimit = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();

    let record = requestCounts.get(ip);

    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now };
      requestCounts.set(ip, record);
    } else {
      record.count++;
    }

    // Headers informativos
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));

    if (record.count > maxRequests) {
      return res.status(429).json({
        error: true,
        message: 'Demasiadas peticiones. Intenta más tarde.',
        retryAfter: Math.ceil((record.startTime + windowMs - now) / 1000)
      });
    }

    next();
  };
};

/**
 * Validador genérico con Zod
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
    const errors = error.issues.map(e => ({
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
 * Middleware 404
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    error: true,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

/**
 * Manejador de errores centralizado
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Error de Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: true,
      message: 'Error de validación',
      details: err.errors
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor'
  });
};
