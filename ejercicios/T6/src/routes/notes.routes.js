/**
 * T6: Rutas de Notes
 */

import { Router } from 'express';
import * as controller from '../controllers/notes.controller.js';

const router = Router();

// Rutas especiales (antes de /:id)
router.get('/trash', controller.getTrash);
router.get('/search', controller.searchNotes);
router.delete('/trash/empty', controller.emptyTrash);

// CRUD
router.get('/', controller.getNotes);
router.get('/:id', controller.getNote);
router.post('/', controller.createNote);
router.put('/:id', controller.updateNote);
router.delete('/:id', controller.deleteNote);

// Soft delete operations
router.post('/:id/restore', controller.restoreNote);
router.delete('/:id/permanent', controller.permanentDeleteNote);

export default router;
