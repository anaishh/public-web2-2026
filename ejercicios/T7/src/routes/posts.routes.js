/**
 * T7: Rutas de Posts
 */

import { Router } from 'express';
import { authenticate, authorize, authorizeOwnerOrAdmin } from '../middleware/auth.middleware.js';
import * as controller from '../controllers/posts.controller.js';

const router = Router();

// Públicas
router.get('/', controller.getPosts);
router.get('/:slug', controller.getPost);

// Protegidas - Author o Admin
router.post('/',
  authenticate,
  authorize('author', 'admin'),
  controller.createPost
);

// Mis borradores
router.get('/me/drafts',
  authenticate,
  controller.getMyDrafts
);

// Solo owner o admin
router.put('/:id',
  authenticate,
  authorize('author', 'admin'),
  authorizeOwnerOrAdmin(controller.getPostOwnerId),
  controller.updatePost
);

router.delete('/:id',
  authenticate,
  authorize('author', 'admin'),
  authorizeOwnerOrAdmin(controller.getPostOwnerId),
  controller.deletePost
);

export default router;
