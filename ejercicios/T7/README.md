# 🔐 Ejercicio T7: API de Blog con Autenticación

## El Blog Seguro

Crea una API de blog con autenticación JWT, roles (user/admin/author) y autorización granular.

**Nivel:** ⭐⭐⭐ Avanzado | **Tiempo:** 40-45 min

## 📖 Historia

Vas a crear el backend de un blog donde:
- Cualquiera puede leer posts
- Solo usuarios registrados pueden comentar
- Solo autores pueden crear/editar sus propios posts
- Admins pueden hacer todo

## 📋 Requisitos

### Modelos

**User**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'author' | 'admin',
  avatar: String (url),
  createdAt: Date
}
```

**Post**
```javascript
{
  title: String,
  slug: String (unique, auto-generado),
  content: String,
  excerpt: String,
  author: ObjectId (ref User),
  published: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Endpoints Auth

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | /api/auth/register | Público |
| POST | /api/auth/login | Público |
| POST | /api/auth/refresh | Público |
| GET | /api/auth/me | Autenticado |
| PUT | /api/auth/me | Autenticado |

### Endpoints Posts

| Método | Ruta | Acceso |
|--------|------|--------|
| GET | /api/posts | Público (solo published) |
| GET | /api/posts/:slug | Público |
| POST | /api/posts | Author/Admin |
| PUT | /api/posts/:id | Owner/Admin |
| DELETE | /api/posts/:id | Owner/Admin |
| GET | /api/posts/drafts | Owner (sus borradores) |

### Autorización

- `user`: Solo puede leer y comentar
- `author`: Puede crear posts, editar/eliminar los suyos
- `admin`: Puede hacer todo

## 🎯 Criterios de éxito

- [ ] Registro con password hasheado (bcrypt)
- [ ] Login devuelve JWT
- [ ] Middleware de autenticación funciona
- [ ] Middleware de roles funciona
- [ ] Un author NO puede editar posts de otro
- [ ] Admin puede editar cualquier post

## 🎁 BONUS

1. Refresh tokens con rotación
2. Endpoint para cambiar password
3. Slug auto-generado del título

## Ejecutar

```bash
cd ejercicios/T7
npm install
npm run dev
```
