/**
 * T5 Ejercicio: Modelo Movie
 *
 * Conceptos aplicados:
 * - Schema con validaciones
 * - Virtual properties
 * - Instance methods
 * - Pre-save hooks
 * - Timestamps
 */

import mongoose from 'mongoose';

const GENRES = ['action', 'comedy', 'drama', 'horror', 'scifi'];
const CURRENT_YEAR = new Date().getFullYear();

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    minlength: [2, 'El título debe tener al menos 2 caracteres'],
    trim: true
  },
  director: {
    type: String,
    required: [true, 'El director es requerido'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'El año es requerido'],
    min: [1900, 'El año debe ser mayor a 1900'],
    max: [CURRENT_YEAR, `El año no puede ser mayor a ${CURRENT_YEAR}`]
  },
  genre: {
    type: String,
    required: [true, 'El género es requerido'],
    enum: {
      values: GENRES,
      message: `El género debe ser uno de: ${GENRES.join(', ')}`
    },
    lowercase: true
  },
  stock: {
    type: Number,
    default: 5,
    min: [0, 'El stock no puede ser negativo']
  },
  initialStock: {
    type: Number,
    default: 5
  },
  rentedCount: {
    type: Number,
    default: 0
  },
  cover: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: película disponible si hay stock
movieSchema.virtual('available').get(function() {
  return this.stock > 0;
});

// BONUS: Método de instancia - ¿Es un clásico?
movieSchema.methods.isClassic = function() {
  return this.year < 2000;
};

// BONUS: Pre-save hook - Capitalizar título
movieSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    // Capitalizar primera letra de cada palabra
    this.title = this.title
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Guardar stock inicial si es documento nuevo
  if (this.isNew) {
    this.initialStock = this.stock;
  }

  next();
});

// Índice para búsquedas frecuentes
movieSchema.index({ genre: 1 });
movieSchema.index({ rentedCount: -1 });
movieSchema.index({ title: 1 }, { unique: true });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
