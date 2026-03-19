import { Router } from 'express';
import {
  getTracks,
  getTrack,
  createTrack,
  updateTrack,
  deleteTrack,
  playTrack,
  likeTrack,
  getTracksByArtist,
  getTopTracks
} from '../controllers/tracks.controller.js';
import { validate, validateObjectId } from '../middleware/validate.middleware.js';
import { createTrackSchema, updateTrackSchema } from '../schemas/track.schema.js';

const router = Router();

// Rutas específicas antes de /:id
router.get('/top', getTopTracks);
router.get('/artist/:artistId', validateObjectId('artistId'), getTracksByArtist);

// CRUD
router.get('/', getTracks);
router.get('/:id', validateObjectId(), getTrack);
router.post('/', validate(createTrackSchema), createTrack);
router.put('/:id', validate(updateTrackSchema), updateTrack);
router.delete('/:id', validateObjectId(), deleteTrack);

// Acciones
router.post('/:id/play', validateObjectId(), playTrack);
router.post('/:id/like', validateObjectId(), likeTrack);

export default router;
