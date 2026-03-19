/**
 * T4: Controlador de Todos
 */

import crypto from 'node:crypto';

// Almacenamiento en memoria
const todos = new Map();

// Seed de datos iniciales
function seedData() {
  const seedTodos = [
    {
      title: 'Aprender Express',
      description: 'Completar el tutorial de Express 5',
      priority: 'high',
      tags: ['estudio', 'nodejs']
    },
    {
      title: 'Comprar café',
      priority: 'low',
      tags: ['personal']
    },
    {
      title: 'Revisar PR del equipo',
      description: 'Hay 3 PRs pendientes de revisión',
      priority: 'medium',
      completed: true,
      tags: ['trabajo']
    }
  ];

  seedTodos.forEach(todo => {
    const id = crypto.randomUUID();
    todos.set(id, {
      id,
      ...todo,
      completed: todo.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });
}

seedData();

/**
 * GET /api/todos - Listar con filtros
 */
export const getTodos = (req, res) => {
  const { completed, priority, tag, search, sortBy, order } = req.query;

  let result = Array.from(todos.values());

  // Filtrar por completada
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    result = result.filter(t => t.completed === isCompleted);
  }

  // Filtrar por prioridad
  if (priority) {
    result = result.filter(t => t.priority === priority);
  }

  // Filtrar por tag
  if (tag) {
    result = result.filter(t => t.tags?.includes(tag));
  }

  // BONUS: Búsqueda en título
  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(t =>
      t.title.toLowerCase().includes(searchLower) ||
      t.description?.toLowerCase().includes(searchLower)
    );
  }

  // Ordenar
  if (sortBy) {
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Manejar prioridad como orden numérico
      if (sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        aVal = priorityOrder[aVal];
        bVal = priorityOrder[bVal];
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  res.json({
    count: result.length,
    data: result
  });
};

/**
 * GET /api/todos/stats - Estadísticas
 */
export const getStats = (req, res) => {
  const allTodos = Array.from(todos.values());

  const stats = {
    total: allTodos.length,
    completed: allTodos.filter(t => t.completed).length,
    pending: allTodos.filter(t => !t.completed).length,
    byPriority: {
      high: allTodos.filter(t => t.priority === 'high').length,
      medium: allTodos.filter(t => t.priority === 'medium').length,
      low: allTodos.filter(t => t.priority === 'low').length
    },
    overdue: allTodos.filter(t =>
      t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
    ).length
  };

  res.json(stats);
};

/**
 * GET /api/todos/:id
 */
export const getTodo = (req, res) => {
  const todo = todos.get(req.params.id);

  if (!todo) {
    return res.status(404).json({
      error: true,
      message: 'Tarea no encontrada'
    });
  }

  res.json({ data: todo });
};

/**
 * POST /api/todos
 */
export const createTodo = (req, res) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const todo = {
    id,
    title: req.body.title,
    description: req.body.description || null,
    priority: req.body.priority || 'medium',
    completed: false,
    dueDate: req.body.dueDate || null,
    tags: req.body.tags || [],
    createdAt: now,
    updatedAt: now
  };

  todos.set(id, todo);

  res.status(201).json({
    message: 'Tarea creada',
    data: todo
  });
};

/**
 * PUT /api/todos/:id
 */
export const updateTodo = (req, res) => {
  const todo = todos.get(req.params.id);

  if (!todo) {
    return res.status(404).json({
      error: true,
      message: 'Tarea no encontrada'
    });
  }

  const updated = {
    ...todo,
    ...req.body,
    id: todo.id, // No permitir cambiar ID
    createdAt: todo.createdAt, // No permitir cambiar fecha creación
    updatedAt: new Date().toISOString()
  };

  todos.set(todo.id, updated);

  res.json({
    message: 'Tarea actualizada',
    data: updated
  });
};

/**
 * DELETE /api/todos/:id
 */
export const deleteTodo = (req, res) => {
  const todo = todos.get(req.params.id);

  if (!todo) {
    return res.status(404).json({
      error: true,
      message: 'Tarea no encontrada'
    });
  }

  todos.delete(req.params.id);

  res.json({
    message: 'Tarea eliminada',
    data: todo
  });
};

/**
 * PATCH /api/todos/:id/toggle
 */
export const toggleTodo = (req, res) => {
  const todo = todos.get(req.params.id);

  if (!todo) {
    return res.status(404).json({
      error: true,
      message: 'Tarea no encontrada'
    });
  }

  todo.completed = !todo.completed;
  todo.updatedAt = new Date().toISOString();

  res.json({
    message: `Tarea ${todo.completed ? 'completada' : 'pendiente'}`,
    data: todo
  });
};
