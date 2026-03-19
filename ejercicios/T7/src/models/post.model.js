/**
 * T7: Modelo Post
 */

import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    minlength: [5, 'Mínimo 5 caracteres'],
    maxlength: [200, 'Máximo 200 caracteres']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    minlength: [50, 'Mínimo 50 caracteres']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Máximo 300 caracteres']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }]
}, {
  timestamps: true,
  versionKey: false
});

// BONUS: Generar slug del título automáticamente
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^a-z0-9\s-]/g, '')    // Solo alfanuméricos
      .replace(/\s+/g, '-')             // Espacios a guiones
      .replace(/-+/g, '-')              // Múltiples guiones a uno
      .substring(0, 100);               // Limitar longitud

    // Añadir timestamp para unicidad
    this.slug += '-' + Date.now().toString(36);
  }

  // Generar excerpt si no existe
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200) + '...';
  }

  next();
});

// Índices
postSchema.index({ slug: 1 });
postSchema.index({ author: 1 });
postSchema.index({ published: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
