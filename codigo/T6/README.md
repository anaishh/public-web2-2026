# T6 - Validación Avanzada y Manejo de Errores

API REST con Express 5, validación con Zod, soft delete y manejo de errores.

## Requisitos

- Node.js 22+
- MongoDB Atlas

## Instalación

```bash
npm install
cp .env.example .env
# Editar .env con tus credenciales
```

## Uso

```bash
npm run dev    # Desarrollo
npm start      # Producción
```

## Características

- ✅ Validación avanzada con Zod (condicionales, transformaciones)
- ✅ Soft delete (borrado lógico con recuperación)
- ✅ Manejo de errores centralizado
- ✅ Rate limiting
- ✅ Sanitización de datos

## Endpoints

### Users

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Obtener usuario |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Soft delete |
| GET | `/api/users/deleted` | Listar eliminados |
| PATCH | `/api/users/:id/restore` | Restaurar |

### Tracks

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/tracks` | Listar tracks |
| GET | `/api/tracks/:id` | Obtener track |
| POST | `/api/tracks` | Crear track |
| PUT | `/api/tracks/:id` | Actualizar track |
| DELETE | `/api/tracks/:id` | Soft delete |
| PATCH | `/api/tracks/:id/restore` | Restaurar |

## Testing

Usar `api.http` con REST Client de VS Code.
