import { Router } from 'express';
import { 
  registerCtrl, 
  loginCtrl, 
  getMeCtrl, 
  updateMeCtrl,
  changePasswordCtrl
} from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/session.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { validatorRegister, validatorLogin } from '../validators/auth.validator.js';

const router = Router();

// Rutas públicas
router.post('/register', validate(validatorRegister), registerCtrl);
router.post('/login', validate(validatorLogin), loginCtrl);

// Rutas protegidas
router.get('/me', authMiddleware, getMeCtrl);
router.put('/me', authMiddleware, updateMeCtrl);
router.put('/password', authMiddleware, changePasswordCtrl);

export default router;
