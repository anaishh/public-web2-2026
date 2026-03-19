/**
 * T5 Ejercicio: BlockBuster API
 * Aplicación principal
 */

import express from 'express';
import mongoose from 'mongoose';
import { mkdir } from 'fs/promises';
import { UPLOADS_DIR } from './config/multer.js';
import moviesRouter from './routes/movies.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blockbuster';

// Crear directorio de uploads si no existe
await mkdir(UPLOADS_DIR, { recursive: true });

// Middleware
app.use(express.json());

// Servir archivos estáticos (carátulas)
app.use('/uploads', express.static(UPLOADS_DIR));

// Rutas
app.use('/api/movies', moviesRouter);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Ruta no encontrada' });
});

// Error handler (incluye errores de Multer)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  // Errores de Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: true,
      message: 'El archivo es demasiado grande. Máximo 5 MB'
    });
  }

  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor'
  });
});

// Conectar a MongoDB e iniciar servidor
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('📦 Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🎬 BlockBuster API en http://localhost:${PORT}`);
      console.log('📼 "Be kind, rewind"');
    });
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  });
