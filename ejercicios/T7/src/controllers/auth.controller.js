/**
 * T7: Controlador de Auth
 */

import User from '../models/user.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry
} from '../utils/jwt.js';

/**
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Verificar si existe
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({
      error: true,
      message: 'El email ya está registrado',
      code: 'EMAIL_EXISTS'
    });
  }

  // Hashear password
  const hashedPassword = await hashPassword(password);

  // Crear usuario (role solo si es válido, por defecto 'user')
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: ['user', 'author'].includes(role) ? role : 'user' // admin solo manual
  });

  // Generar tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  // Guardar refresh token
  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: getRefreshTokenExpiry()
  });

  res.status(201).json({
    message: 'Usuario registrado',
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario con password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      error: true,
      message: 'Credenciales inválidas',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Verificar password
  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return res.status(401).json({
      error: true,
      message: 'Credenciales inválidas',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Generar tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  // Guardar refresh token
  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: getRefreshTokenExpiry()
  });

  res.json({
    message: 'Login exitoso',
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

/**
 * POST /api/auth/refresh
 */
export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      error: true,
      message: 'Refresh token requerido',
      code: 'NO_REFRESH_TOKEN'
    });
  }

  // Buscar token
  const storedToken = await RefreshToken.findOne({ token: refreshToken })
    .populate('user');

  if (!storedToken) {
    return res.status(401).json({
      error: true,
      message: 'Refresh token no válido',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }

  // Verificar si fue revocado (posible robo)
  if (storedToken.revokedAt) {
    // Revocar todos los tokens del usuario por seguridad
    await RefreshToken.updateMany(
      { user: storedToken.user._id },
      { revokedAt: new Date() }
    );

    return res.status(401).json({
      error: true,
      message: 'Token comprometido - todas las sesiones revocadas',
      code: 'TOKEN_REUSE_DETECTED'
    });
  }

  // Verificar expiración
  if (!storedToken.isActive()) {
    return res.status(401).json({
      error: true,
      message: 'Refresh token expirado',
      code: 'REFRESH_TOKEN_EXPIRED'
    });
  }

  // Revocar token actual (rotación)
  storedToken.revokedAt = new Date();
  await storedToken.save();

  // Generar nuevos tokens
  const newAccessToken = generateAccessToken(storedToken.user);
  const newRefreshToken = generateRefreshToken();

  await RefreshToken.create({
    token: newRefreshToken,
    user: storedToken.user._id,
    expiresAt: getRefreshTokenExpiry()
  });

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  res.json({
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt
    }
  });
};

/**
 * PUT /api/auth/me
 */
export const updateMe = async (req, res) => {
  const { name, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  );

  res.json({
    message: 'Perfil actualizado',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
};

/**
 * PUT /api/auth/password - BONUS
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Obtener usuario con password
  const user = await User.findById(req.user._id).select('+password');

  // Verificar password actual
  const isValid = await comparePassword(currentPassword, user.password);

  if (!isValid) {
    return res.status(401).json({
      error: true,
      message: 'Contraseña actual incorrecta',
      code: 'INVALID_PASSWORD'
    });
  }

  // Hashear nueva password
  user.password = await hashPassword(newPassword);
  await user.save();

  // Revocar todos los refresh tokens
  await RefreshToken.updateMany(
    { user: user._id },
    { revokedAt: new Date() }
  );

  res.json({
    message: 'Contraseña cambiada. Por seguridad, todas las sesiones han sido cerradas.'
  });
};
