/**
 * Agregador de Rutas
 */

import { Router } from 'express';
import cursosRoutes from './cursos.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    nombre: 'API de Cursos',
    version: '1.0.0',
    endpoints: {
      cursos: '/api/cursos/programacion',
      health: '/health'
    }
  });
});

router.use('/cursos/programacion', cursosRoutes);

export default router;
