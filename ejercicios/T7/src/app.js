/**
 * T7 Ejercicio: Blog API con Autenticación
 */

import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.routes.js';
import postsRouter from './routes/posts.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-api';

// Middleware
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: true,
      message: 'Error de validación',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: true,
      message: 'El recurso ya existe'
    });
  }

  res.status(500).json({
    error: true,
    message: err.message || 'Error interno'
  });
});

// Conectar
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('📦 Conectado a MongoDB');

    app.listen(PORT, () => {
      console.log('═'.repeat(50));
      console.log('📝 Blog API - JWT Auth');
      console.log('═'.repeat(50));
      console.log(`📡 http://localhost:${PORT}`);
      console.log('');
      console.log('Auth:');
      console.log('  POST /api/auth/register');
      console.log('  POST /api/auth/login');
      console.log('  POST /api/auth/refresh');
      console.log('  GET  /api/auth/me');
      console.log('');
      console.log('Posts:');
      console.log('  GET  /api/posts (público)');
      console.log('  POST /api/posts (author/admin)');
      console.log('  PUT  /api/posts/:id (owner/admin)');
      console.log('═'.repeat(50));
    });
  })
  .catch((err) => {
    console.error('Error MongoDB:', err.message);
    process.exit(1);
  });
