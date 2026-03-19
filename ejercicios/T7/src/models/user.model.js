/**
 * T7: Modelo User
 */

import mongoose from 'mongoose';

const ROLES = ['user', 'author', 'admin'];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'Mínimo 2 caracteres'],
    maxlength: [100, 'Máximo 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [8, 'Mínimo 8 caracteres'],
    select: false // No incluir en consultas por defecto
  },
  role: {
    type: String,
    enum: ROLES,
    default: 'user'
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índice para búsqueda por email
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
