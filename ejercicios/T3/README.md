# 🔗 Ejercicio T3: URL Shortener Nativo

## Acortador de URLs sin frameworks

Crea un acortador de URLs usando solo el módulo `node:http`, sin Express ni otros frameworks.

**Nivel:** ⭐⭐⭐ Avanzado | **Tiempo:** 30-35 min

## 📖 Historia

Quieres demostrar que puedes construir una API REST funcional sin dependencias. Tu jefe no está convencido de que necesiten Express, así que le vas a demostrar cómo funciona HTTP "a pelo".

## 📋 Requisitos

### Endpoints a implementar

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /shorten | Crea URL corta |
| GET | /:code | Redirige a URL original |
| GET | /stats/:code | Estadísticas de la URL |
| GET | /api/urls | Lista todas las URLs |
| DELETE | /api/urls/:code | Elimina una URL |

### Formato de datos

```javascript
// POST /shorten body:
{ "url": "https://ejemplo.com/pagina-muy-larga" }

// Response:
{
  "code": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "originalUrl": "https://ejemplo.com/pagina-muy-larga",
  "createdAt": "2025-01-01T12:00:00.000Z"
}
```

### Almacenamiento en memoria

```javascript
const urls = new Map();
// code -> { originalUrl, createdAt, visits, lastVisit }
```

## 🎯 Criterios de éxito

- [ ] Solo usa node:http (sin Express)
- [ ] Parsea JSON del body correctamente
- [ ] Genera códigos únicos de 6 caracteres
- [ ] Redirección con status 302
- [ ] Cuenta visitas por URL
- [ ] Maneja errores (URL inválida, código no existe)

## 🎁 BONUS

1. Validar que la URL sea válida antes de acortar
2. Añadir expiración (URLs que caducan en 24h)
3. Limitar a 100 URLs en memoria (FIFO)

## Ejecutar

```bash
cd ejercicios/T3
node src/server.js
```

## Tests

```bash
# Crear URL corta
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com"}'

# Visitar (redirige)
curl -I http://localhost:3000/abc123

# Ver estadísticas
curl http://localhost:3000/stats/abc123
```
