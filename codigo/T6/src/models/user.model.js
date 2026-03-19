import mongoose from 'mongoose';
import { softDeletePlugin } from '../plugins/softDelete.plugin.js';

const userSchema = new mongoose.Schema(
  {
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
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email no válido']
    },
    age: {
      type: Number,
      min: [0, 'Edad no puede ser negativa'],
      max: [120, 'Edad no válida']
    },
    avatar: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });

// Aplicar soft delete
userSchema.plugin(softDeletePlugin);

const User = mongoose.model('User', userSchema);

export default User;
