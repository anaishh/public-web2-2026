# T5 - MVC y MongoDB

API REST con Express 5, MongoDB y patrón MVC.

## Requisitos

- Node.js 22+
- Cuenta en MongoDB Atlas

## Instalación

```bash
npm install
cp .env.example .env
# Editar .env con tus credenciales de MongoDB
```

## Uso

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints

### Users

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Obtener usuario |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

### Tracks

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/tracks` | Listar tracks |
| GET | `/api/tracks/top` | Top tracks |
| GET | `/api/tracks/:id` | Obtener track |
| POST | `/api/tracks` | Crear track |
| PUT | `/api/tracks/:id` | Actualizar track |
| DELETE | `/api/tracks/:id` | Eliminar track |
| POST | `/api/tracks/:id/play` | Registrar reproducción |

### Storage

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/storage` | Listar archivos |
| POST | `/api/storage` | Subir archivo |
| DELETE | `/api/storage/:id` | Eliminar archivo |

## Testing

Usa el archivo `api.http` con la extensión REST Client de VS Code.
