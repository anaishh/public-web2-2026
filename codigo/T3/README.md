# Tema 3: HTTP y Enrutamiento - Código de Ejemplo

## 📋 Contenido

```
T3/
├── src/
│   ├── 01-basic-server.js    # Servidor HTTP básico
│   ├── 02-routing.js         # API REST con routing manual
│   └── 03-fetch-client.js    # Cliente HTTP con fetch nativo
├── api.http                   # Peticiones para REST Client
├── package.json
└── README.md
```

## 🚀 Inicio Rápido

```bash
# No requiere npm install (sin dependencias)

# Ejecutar servidor básico
npm run basic

# Ejecutar API con routing
npm run routing

# Ejecutar cliente HTTP (requiere routing activo)
npm run client
```

## 📝 Ejemplos

### 01. Servidor HTTP Básico
- Uso de `node:http`
- Parseo de URLs y query params
- Routing básico con if/else

### 02. API REST con Routing
- CRUD completo
- Parámetros de ruta
- Lectura del body

### 03. Cliente HTTP con fetch
- `fetch` nativo (Node.js 21+)
- Peticiones GET, POST, PATCH, DELETE
- Manejo de errores

## 🧪 Probar con REST Client

1. Instala "REST Client" en VS Code
2. Abre `api.http`
3. Clic en "Send Request"

## 🔧 Requisitos

- Node.js 20.11.0+
