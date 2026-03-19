/**
 * T7: Modelo RefreshToken
 */

import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL: MongoDB elimina automáticamente
  },
  revokedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Método para verificar si está activo
refreshTokenSchema.methods.isActive = function() {
  return !this.revokedAt && this.expiresAt > new Date();
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
