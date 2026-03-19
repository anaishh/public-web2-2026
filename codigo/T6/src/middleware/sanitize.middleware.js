/**
 * Elimina campos peligrosos de req.body (previene inyección NoSQL)
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    const sanitize = (obj) => {
      for (const key in obj) {
        // Eliminar operadores MongoDB ($gt, $lt, etc.)
        if (key.startsWith('$')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(req.body);
  }
  next();
};

/**
 * Limita el tamaño de strings
 */
export const limitStringLength = (maxLength = 10000) => (req, res, next) => {
  const checkLength = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].length > maxLength) {
        obj[key] = obj[key].substring(0, maxLength);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        checkLength(obj[key]);
      }
    }
  };
  
  if (req.body) checkLength(req.body);
  next();
};
