import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      minlength: [1, 'El título no puede estar vacío'],
      maxlength: [200, 'Máximo 200 caracteres']
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El artista es requerido']
    },
    collaborators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    duration: {
      type: Number,
      required: [true, 'La duración es requerida'],
      min: [1, 'Mínimo 1 segundo'],
      max: [36000, 'Máximo 10 horas']
    },
    genres: {
      type: [String],
      validate: {
        validator: (v) => v && v.length > 0,
        message: 'Debe tener al menos un género'
      }
    },
    audioFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Storage'
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Storage'
    },
    plays: {
      type: Number,
      default: 0,
      min: 0
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    isPublic: {
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
trackSchema.index({ artist: 1 });
trackSchema.index({ plays: -1 });
trackSchema.index({ isPublic: 1, createdAt: -1 });
trackSchema.index({ title: 'text' });

// Virtual: duración formateada
trackSchema.virtual('durationFormatted').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

trackSchema.set('toJSON', { virtuals: true });
trackSchema.set('toObject', { virtuals: true });

const Track = mongoose.model('Track', trackSchema);

export default Track;
