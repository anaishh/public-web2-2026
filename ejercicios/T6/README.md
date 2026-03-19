# 🗑️ Ejercicio T6: Sistema de Notas con Soft Delete

## La Papelera Inteligente

Crea una API de notas con borrado lógico, recuperación y sistema robusto de errores.

**Nivel:** ⭐⭐⭐ Avanzado | **Tiempo:** 30-35 min

## 📖 Historia

Tu empresa tiene una app de notas y los usuarios se quejan de que "borran sin querer". La solución: soft delete con papelera y opción de recuperar notas en 30 días.

## 📋 Requisitos

### Modelo Note

```javascript
{
  title: String,
  content: String,
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'white',
  pinned: Boolean,
  // Soft delete fields
  deleted: Boolean,
  deletedAt: Date,
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/notes | Listar (excluye eliminadas) |
| GET | /api/notes/trash | Listar papelera |
| GET | /api/notes/:id | Obtener una |
| POST | /api/notes | Crear |
| PUT | /api/notes/:id | Actualizar |
| DELETE | /api/notes/:id | Soft delete |
| POST | /api/notes/:id/restore | Restaurar |
| DELETE | /api/notes/:id/permanent | Hard delete |
| DELETE | /api/notes/trash/empty | Vaciar papelera |

### Clase AppError

Implementar clase de error personalizada con factory methods:
- `AppError.badRequest(message)`
- `AppError.notFound(resource)`
- `AppError.validation(message, details)`

### Middleware de errores

Debe capturar:
- Errores de validación de Mongoose
- Errores de Zod
- Errores de CastError (ID inválido)
- AppError personalizados

## 🎯 Criterios de éxito

- [ ] Soft delete funcionando
- [ ] GET /notes excluye eliminadas
- [ ] Restaurar funciona
- [ ] AppError con factory methods
- [ ] Error handler centralizado

## 🎁 BONUS

1. Auto-eliminar notas en papelera > 30 días
2. Endpoint /notes/search con búsqueda full-text
3. Añadir campo `deletedBy` para auditoría

## Ejecutar

```bash
cd ejercicios/T6
npm install
npm run dev
```
