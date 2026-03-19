/**
 * T4 Ejercicio: Todo API con Express
 *
 * Conceptos aplicados:
 * - Express 5
 * - Middleware personalizado
 * - Validación con Zod
 * - Manejo de errores centralizado
 * - Filtros y ordenamiento
 */

import express from 'express';
import todosRouter from './routes/todos.routes.js';
import { requestLogger, errorHandler, notFound } from './middleware/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware globales
app.use(express.json());
app.use(requestLogger);

// Rutas
app.use('/api/todos', todosRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 y error handler
app.use(notFound);
app.use(errorHandler);

// Iniciar
app.listen(PORT, () => {
  console.log('═'.repeat(50));
  console.log('📝 Todo API - Express + Zod');
  console.log('═'.repeat(50));
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`📋 Endpoints: /api/todos`);
  console.log('═'.repeat(50));
});
