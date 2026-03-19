import express from 'express';
import cors from 'cors';
import dbConnect from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { sanitizeBody } from './middleware/sanitize.middleware.js';

const app = express();

// ============================================
// Middleware globales
// ============================================

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeBody);

// Archivos estáticos
app.use('/uploads', express.static('storage'));

// ============================================
// Rutas
// ============================================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api', routes);

// ============================================
// Manejo de errores
// ============================================

app.use(notFound);
app.use(errorHandler);

// ============================================
// Iniciar servidor
// ============================================

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
      console.log(`📚 API en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
};

startServer();
