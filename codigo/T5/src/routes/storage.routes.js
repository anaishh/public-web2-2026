import { Router } from 'express';
import uploadMiddleware from '../utils/handleStorage.js';
import {
  uploadFile,
  uploadMultipleFiles,
  getFiles,
  getFile,
  deleteFile,
  getFilesByType
} from '../controllers/storage.controller.js';
import { validateObjectId } from '../middleware/validate.middleware.js';

const router = Router();

// Rutas específicas antes de /:id
router.get('/type/:type', getFilesByType);

// CRUD
router.get('/', getFiles);
router.get('/:id', validateObjectId(), getFile);
router.post('/', uploadMiddleware.single('file'), uploadFile);
router.post('/multiple', uploadMiddleware.array('files', 5), uploadMultipleFiles);
router.delete('/:id', validateObjectId(), deleteFile);

export default router;
