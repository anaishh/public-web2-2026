import { Router } from 'express';
import {
  getTracks,
  getTrack,
  createTrack,
  updateTrack,
  deleteTrack,
  restoreTrack,
  playTrack,
  likeTrack,
  getTopTracks,
  getDeletedTracks
} from '../controllers/tracks.controller.js';
import { validate, validateObjectId } from '../middleware/validate.middleware.js';
import { rateLimit } from '../middleware/rateLimit.middleware.js';
import { createTrackSchema, updateTrackSchema, listTracksSchema } from '../schemas/track.schema.js';

const router = Router();

// Rutas especiales (antes de /:id)
router.get('/top', getTopTracks);
router.get('/deleted', getDeletedTracks);

// CRUD básico
router.get('/', validate(listTracksSchema), getTracks);
router.get('/:id', validateObjectId(), getTrack);
router.post('/', rateLimit(20, 60 * 1000), validate(createTrackSchema), createTrack);
router.put('/:id', validate(updateTrackSchema), updateTrack);
router.delete('/:id', validateObjectId(), deleteTrack);

// Restaurar
router.patch('/:id/restore', validateObjectId(), restoreTrack);

// Acciones con rate limit
router.post('/:id/play', rateLimit(60, 60 * 1000), validateObjectId(), playTrack);
router.post('/:id/like', rateLimit(30, 60 * 1000), validateObjectId(), likeTrack);

export default router;
