# 📝 Ejercicio T4: Todo API con Express

## Lista de Tareas con Validación Pro

Crea una API de tareas (todos) con Express, middleware personalizado y validación con Zod.

**Nivel:** ⭐⭐ Intermedio | **Tiempo:** 25-30 min

## 📖 Historia

Tu equipo necesita una API de tareas interna. Pero esta vez quieren algo "profesional": validación estricta, middleware de logging, filtros, y ordenamiento. Nada de APIs cutre.

## 📋 Requisitos

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/todos | Listar (con filtros) |
| GET | /api/todos/:id | Obtener una |
| POST | /api/todos | Crear tarea |
| PUT | /api/todos/:id | Actualizar |
| DELETE | /api/todos/:id | Eliminar |
| PATCH | /api/todos/:id/toggle | Cambiar completada |

### Modelo de tarea

```javascript
{
  id: 'uuid',
  title: string (3-100 chars),
  description: string (opcional, max 500),
  priority: 'low' | 'medium' | 'high',
  completed: boolean,
  dueDate: Date (opcional, debe ser futuro),
  tags: string[] (máx 5 tags),
  createdAt: Date,
  updatedAt: Date
}
```

### Filtros en GET /api/todos

```
GET /api/todos?completed=true
GET /api/todos?priority=high
GET /api/todos?tag=trabajo
GET /api/todos?sortBy=dueDate&order=asc
```

### Validación con Zod

- `title`: 3-100 caracteres
- `priority`: enum ['low', 'medium', 'high']
- `dueDate`: fecha futura (si se proporciona)
- `tags`: array de máximo 5 strings

## 🎯 Criterios de éxito

- [ ] Express con estructura modular
- [ ] Middleware de logging con timestamps
- [ ] Validación con Zod en todas las rutas
- [ ] Filtros funcionando
- [ ] Manejo centralizado de errores

## 🎁 BONUS

1. Middleware de rate limiting (máx 100 req/min)
2. Endpoint de estadísticas: /api/todos/stats
3. Búsqueda fuzzy en título: ?search=texto

## Ejecutar

```bash
cd ejercicios/T4
npm install
npm run dev
```
