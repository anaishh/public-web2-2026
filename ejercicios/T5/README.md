# 🎬 Ejercicio T5: BlockBuster API

## El Videoclub del Futuro (que ya es pasado)

## 📖 Historia

Un millonario excéntrico y nostálgico quiere recrear la experiencia de los videoclubs de los 90s, pero con tecnología moderna. Te ha contratado para crear la API que gestione su catálogo de películas y el sistema de alquiler.

El sistema debe permitir a los usuarios ver el catálogo, alquilar películas (si hay copias disponibles), devolverlas, y consultar estadísticas de las más populares.

## 📋 Requisitos

### Modelo Movie

```javascript
{
  title: String,        // Requerido, mín 2 caracteres
  director: String,     // Requerido
  year: Number,         // Entre 1888 y año actual
  genre: String,        // Enum: action, comedy, drama, horror, scifi
  copies: Number,       // Total de copias (default: 5)
  availableCopies: Number, // Copias disponibles
  timesRented: Number   // Contador de alquileres (default: 0)
}
```

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/movies | Listar películas (filtro: `?genre=comedy`) |
| GET | /api/movies/:id | Obtener película por ID |
| POST | /api/movies | Crear nueva película |
| PUT | /api/movies/:id | Actualizar película |
| DELETE | /api/movies/:id | Eliminar película |
| POST | /api/movies/:id/rent | Alquilar película |
| POST | /api/movies/:id/return | Devolver película |
| GET | /api/movies/stats/top | Top 5 más alquiladas |

### Lógica de negocio

1. **Alquilar**: Decrementa `availableCopies`, incrementa `timesRented`
2. **Devolver**: Incrementa `availableCopies` (sin exceder `copies`)
3. **Validar**: No permitir alquilar si `availableCopies === 0`

## 🚀 Ejecutar

```bash
cd ejercicios/T5
npm install
cp .env.example .env
# Editar .env con tu MONGODB_URI
npm run dev
```

## 🧪 Tests

Usa el archivo `tests/movies.http` con la extensión REST Client de VS Code.

## 🎯 Criterios de éxito

- [ ] CRUD completo de películas funcionando
- [ ] Filtro por género implementado
- [ ] Sistema de alquiler/devolución con validaciones
- [ ] Estadísticas de top 5 películas
- [ ] Manejo de errores apropiado (404, 400, etc.)
- [ ] Validaciones en el modelo Mongoose

## 🎁 BONUS

- Añadir paginación a GET /api/movies (`?page=1&limit=10`)
- Implementar búsqueda por título (`?search=matrix`)
- Añadir campo `rating` y endpoint para valorar películas
- Crear endpoint `/api/movies/available` que solo muestre películas con copias disponibles
