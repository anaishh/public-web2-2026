/**
 * T6 Ejercicio: Notes API con Soft Delete
 */

import express from 'express';
import mongoose from 'mongoose';
import notesRouter from './routes/notes.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import Note from './models/note.model.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-app';

// Middleware
app.use(express.json());

// Rutas
app.use('/api/notes', notesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Conectar y arrancar
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('📦 Conectado a MongoDB');

    // BONUS: Limpiar notas expiradas al iniciar
    const deleted = await Note.deleteExpired(30);
    if (deleted.deletedCount > 0) {
      console.log(`🗑️ ${deleted.deletedCount} notas expiradas eliminadas`);
    }

    app.listen(PORT, () => {
      console.log('═'.repeat(50));
      console.log('📝 Notes API - Soft Delete');
      console.log('═'.repeat(50));
      console.log(`📡 http://localhost:${PORT}`);
      console.log('');
      console.log('Endpoints:');
      console.log('  GET    /api/notes           - Listar');
      console.log('  GET    /api/notes/trash     - Papelera');
      console.log('  GET    /api/notes/search?q= - Buscar');
      console.log('  POST   /api/notes           - Crear');
      console.log('  DELETE /api/notes/:id       - Soft delete');
      console.log('  POST   /api/notes/:id/restore - Restaurar');
      console.log('  DELETE /api/notes/:id/permanent - Hard delete');
      console.log('  DELETE /api/notes/trash/empty - Vaciar papelera');
      console.log('═'.repeat(50));
    });
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

// BONUS: Limpiar notas expiradas cada día
setInterval(async () => {
  try {
    const deleted = await Note.deleteExpired(30);
    if (deleted.deletedCount > 0) {
      console.log(`🗑️ Auto-limpieza: ${deleted.deletedCount} notas expiradas eliminadas`);
    }
  } catch (err) {
    console.error('Error en auto-limpieza:', err.message);
  }
}, 24 * 60 * 60 * 1000); // Cada 24 horas
