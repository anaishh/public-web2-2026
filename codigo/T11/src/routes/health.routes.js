// src/routes/health.routes.js
// Endpoints de health check para monitoreo

import { Router } from 'express';

const router = Router();

// Estado de la aplicación
let isReady = false;

// Marcar como listo después de inicialización
export const setReady = () => {
  isReady = true;
};

// Health check básico (para Docker/K8s liveness probe)
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Readiness check (para K8s readiness probe)
router.get('/ready', (req, res) => {
  if (!isReady) {
    return res.status(503).json({
      status: 'not_ready',
      message: 'Application is starting up'
    });
  }

  res.json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// Health check detallado (para monitoreo interno)
router.get('/health/detailed', async (req, res) => {
  const checks = {
    server: { status: 'ok' },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  };

  // Aquí podrían agregarse checks de DB, Redis, etc.
  // try {
  //   await prisma.$queryRaw`SELECT 1`;
  //   checks.database = { status: 'ok' };
  // } catch (error) {
  //   checks.database = { status: 'error', message: error.message };
  // }

  const allHealthy = Object.values(checks)
    .filter(c => typeof c === 'object' && c.status)
    .every(c => c.status === 'ok');

  res.status(allHealthy ? 200 : 503).json(checks);
});

export default router;
