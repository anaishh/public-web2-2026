/**
 * T6: Modelo Note con Soft Delete
 */

import mongoose from 'mongoose';
import { softDeletePlugin } from '../plugins/softDelete.plugin.js';

const COLORS = ['yellow', 'blue', 'green', 'pink', 'white'];

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  content: {
    type: String,
    trim: true,
    maxlength: [5000, 'El contenido no puede exceder 5000 caracteres']
  },
  color: {
    type: String,
    enum: {
      values: COLORS,
      message: `El color debe ser uno de: ${COLORS.join(', ')}`
    },
    default: 'yellow'
  },
  pinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

// Aplicar plugin de soft delete
noteSchema.plugin(softDeletePlugin);

// Índices
noteSchema.index({ title: 'text', content: 'text' });
noteSchema.index({ pinned: -1, createdAt: -1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;
