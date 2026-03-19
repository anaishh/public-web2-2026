import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  getDeletedUsers
} from '../controllers/users.controller.js';
import { validate, validateObjectId } from '../middleware/validate.middleware.js';
import { 
  createUserSchema,
  updateUserSchema, 
  listUsersSchema 
} from '../schemas/user.schema.js';

const router = Router();

// Listar usuarios eliminados (antes de /:id para evitar conflicto)
router.get('/deleted', getDeletedUsers);

// CRUD
router.get('/', validate(listUsersSchema), getUsers);
router.get('/:id', validateObjectId(), getUser);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', validateObjectId(), deleteUser);

// Restaurar
router.patch('/:id/restore', validateObjectId(), restoreUser);

export default router;
