// Almacén en memoria (usar Redis en producción)
const requestCounts = new Map();

/**
 * Limita peticiones por IP
 * @param {number} maxRequests - Máximo de peticiones
 * @param {number} windowMs - Ventana de tiempo en ms
 */
export const rateLimit = (maxRequests = 100, windowMs = 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
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
    res.setHeader('X-RateLimit-Reset', new Date(record.startTime + windowMs).toISOString());
    
    if (record.count > maxRequests) {
      return res.status(429).json({
        error: true,
        message: 'Demasiadas peticiones. Intenta más tarde.',
        code: 'RATE_LIMIT',
        retryAfter: Math.ceil((record.startTime + windowMs - now) / 1000)
      });
    }
    
    next();
  };
};

// Limpieza periódica
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now - record.startTime > 60 * 1000) {
      requestCounts.delete(ip);
    }
  }
}, 60 * 1000);
