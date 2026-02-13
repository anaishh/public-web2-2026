/**
 * Rutas de Cursos con validación Zod
 */

import { Router } from 'express';
import * as controller from '../controllers/cursos.controller.js';
import { validate } from '../middleware/validateRequest.js';
import {
  createCursoSchema,
  updateCursoSchema,
  patchCursoSchema,
  getCursoByIdSchema
} from '../schemas/cursos.schema.js';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', validate(getCursoByIdSchema), controller.getById);
router.post('/', validate(createCursoSchema), controller.create);
router.put('/:id', validate(updateCursoSchema), controller.update);
router.patch('/:id', validate(patchCursoSchema), controller.partialUpdate);
router.delete('/:id', validate(getCursoByIdSchema), controller.remove);

export default router;
