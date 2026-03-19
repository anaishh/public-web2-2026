import mongoose from 'mongoose';

const storageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'El filename es requerido']
    },
    originalName: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: [true, 'La URL es requerida']
    },
    mimetype: {
      type: String,
      required: [true, 'El mimetype es requerido']
    },
    size: {
      type: Number,
      required: [true, 'El tamaño es requerido'],
      min: 0
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices
storageSchema.index({ uploadedBy: 1 });
storageSchema.index({ mimetype: 1 });
storageSchema.index({ createdAt: -1 });

// Virtual: tamaño formateado
storageSchema.virtual('sizeFormatted').get(function() {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (this.size === 0) return '0 Bytes';
  const i = Math.floor(Math.log(this.size) / Math.log(1024));
  return parseFloat((this.size / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
});

// Virtual: tipo de archivo
storageSchema.virtual('fileType').get(function() {
  if (!this.mimetype) return 'unknown';
  if (this.mimetype.startsWith('image/')) return 'image';
  if (this.mimetype.startsWith('audio/')) return 'audio';
  if (this.mimetype.startsWith('video/')) return 'video';
  return 'document';
});

storageSchema.set('toJSON', { virtuals: true });
storageSchema.set('toObject', { virtuals: true });

const Storage = mongoose.model('Storage', storageSchema);

export default Storage;
