/**
 * T4: Rutas de Todos
 */

import { Router } from 'express';
import { validate, rateLimit } from '../middleware/index.js';
import {
  createTodoSchema,
  updateTodoSchema,
  listTodosSchema,
  todoIdSchema
} from '../schemas/todo.schema.js';
import * as controller from '../controllers/todos.controller.js';

const router = Router();

// BONUS: Rate limiting
router.use(rateLimit(100, 60000));

// Estadísticas (debe ir antes de /:id)
router.get('/stats', controller.getStats);

// CRUD con validación
router.get('/', validate(listTodosSchema), controller.getTodos);
router.get('/:id', validate(todoIdSchema), controller.getTodo);
router.post('/', validate(createTodoSchema), controller.createTodo);
router.put('/:id', validate(updateTodoSchema), controller.updateTodo);
router.delete('/:id', validate(todoIdSchema), controller.deleteTodo);

// Toggle completado
router.patch('/:id/toggle', validate(todoIdSchema), controller.toggleTodo);

export default router;
