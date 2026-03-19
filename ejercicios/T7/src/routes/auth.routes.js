/**
 * T7: Rutas de Auth
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as controller from '../controllers/auth.controller.js';

const router = Router();

// Públicas
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);

// Protegidas
router.get('/me', authenticate, controller.getMe);
router.put('/me', authenticate, controller.updateMe);
router.put('/password', authenticate, controller.changePassword);

export default router;
