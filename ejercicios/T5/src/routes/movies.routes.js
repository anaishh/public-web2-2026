/**
 * T5 Ejercicio: Rutas de Movies
 */

import { Router } from 'express';
import * as controller from '../controllers/movies.controller.js';
import { uploadCover } from '../config/multer.js';

const router = Router();

// Estadísticas (debe ir ANTES de /:id para que no lo capture)
router.get('/stats/top', controller.getTopMovies);

// CRUD básico
router.get('/', controller.getMovies);
router.get('/:id', controller.getMovie);
router.post('/', controller.createMovie);
router.delete('/:id', controller.deleteMovie);

// Operaciones de alquiler
router.post('/:id/rent', controller.rentMovie);
router.post('/:id/return', controller.returnMovie);

// Carátula
router.patch('/:id/cover', uploadCover.single('cover'), controller.uploadMovieCover);
router.get('/:id/cover', controller.getMovieCover);

export default router;
