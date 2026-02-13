# Tema 4: Framework Express 5 - Código de Ejemplo

## 📋 Estructura

```
T4/
├── src/
│   ├── index.js              # Punto de entrada
│   ├── app.js                # Configuración Express
│   ├── config/env.js         # Validación de entorno
│   ├── routes/               # Rutas modulares
│   ├── controllers/          # Lógica de negocio
│   ├── middleware/           # Error handler + validación
│   ├── schemas/              # Schemas Zod
│   └── data/                 # Datos de ejemplo
├── api.http
├── .env
└── package.json
```

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo (con hot reload)
npm run dev

# Producción
npm start
```

## 📡 Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/api/cursos/programacion` | Listar cursos |
| GET | `/api/cursos/programacion/:id` | Obtener curso |
| POST | `/api/cursos/programacion` | Crear curso |
| PUT | `/api/cursos/programacion/:id` | Actualizar completo |
| PATCH | `/api/cursos/programacion/:id` | Actualizar parcial |
| DELETE | `/api/cursos/programacion/:id` | Eliminar |

## ✨ Características

- **Express 5.1** con async error handling automático
- **Zod** para validación
- **ESM** nativo
- **--env-file** sin dotenv
- **--watch** sin nodemon

## 🔧 Requisitos

- Node.js 20.11.0+
