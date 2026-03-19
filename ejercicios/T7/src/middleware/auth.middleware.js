/**
 * T7: Middleware de Autenticación y Autorización
 */

import User from '../models/user.model.js';
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Middleware de autenticación
 * Verifica el token y añade req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Verificar header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: true,
        message: 'Token no proporcionado',
        code: 'NO_TOKEN'
      });
    }

    // Extraer token
    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        error: true,
        message: 'Token inválido o expirado',
        code: 'INVALID_TOKEN'
      });
    }

    // Buscar usuario
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Añadir usuario a la request
    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({
      error: true,
      message: 'Error de autenticación',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware de autorización por roles
 * @param {string[]} roles - Roles permitidos
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'No autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: true,
        message: 'No tienes permiso para esta acción',
        code: 'FORBIDDEN',
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware para verificar propiedad del recurso
 * @param {Function} getResourceOwnerId - Función que obtiene el owner ID del recurso
 */
export const authorizeOwnerOrAdmin = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      // Admin puede hacer todo
      if (req.user.role === 'admin') {
        return next();
      }

      // Obtener owner del recurso
      const ownerId = await getResourceOwnerId(req);

      if (!ownerId) {
        return res.status(404).json({
          error: true,
          message: 'Recurso no encontrado',
          code: 'NOT_FOUND'
        });
      }

      // Verificar si es el dueño
      if (ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          error: true,
          message: 'No puedes modificar recursos de otros usuarios',
          code: 'NOT_OWNER'
        });
      }

      next();

    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'Error verificando permisos'
      });
    }
  };
};
