import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser
} from '../controllers/users.controller.js';
import { validate, validateObjectId } from '../middleware/validate.middleware.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', validateObjectId(), getUser);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', validateObjectId(), deleteUser);
router.patch('/:id/deactivate', validateObjectId(), deactivateUser);

export default router;
