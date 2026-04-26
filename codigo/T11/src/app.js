// src/app.js
// Servidor Express configurado para producción

import express from 'express';
import { config, validateConfig } from './config/index.js';
import healthRoutes, { setReady } from './routes/health.routes.js';

// Validar configuración
validateConfig();

const app = express();

// Middleware
app.use(express.json());

// Trust proxy (para obtener IP real detrás de nginx/load balancer)
app.set('trust proxy', 1);

// Rutas
app.use(healthRoutes);

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando',
    environment: config.env,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: config.isDev ? err.message : 'Error interno del servidor'
  });
});

// Iniciar servidor
const server = app.listen(config.port, config.host, () => {
  console.log(`Servidor en http://${config.host}:${config.port}`);
  console.log(`Entorno: ${config.env}`);

  // Marcar como listo
  setReady();
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} recibido. Cerrando servidor...`);

  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });

  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    console.error('Cierre forzado después de timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
