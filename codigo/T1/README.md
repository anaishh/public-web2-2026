# Tema 1: Fundamentos de Node.js

Ejemplos prácticos del Tema 1 del curso de Node.js Backend.

## Requisitos

- Node.js 22 o superior
- Sin dependencias externas (usa solo módulos nativos)

## Estructura

```
T1/
├── src/
│   ├── 01-hello-world.js      # Hello World y info básica
│   ├── 02-event-loop.js       # Orden de ejecución
│   ├── 03-esm-modules.js      # Import/export ESM
│   ├── 04-fs-promises.js      # Sistema de archivos
│   ├── 05-path-examples.js    # Manipulación de rutas
│   ├── 06-os-info.js          # Info del sistema
│   ├── 07-crypto-examples.js  # Criptografía
│   ├── 08-process-info.js     # Objeto process
│   ├── 09-timers.js           # setTimeout, setInterval
│   ├── 10-http-server.js      # Servidor HTTP nativo
│   ├── math.test.js           # Tests con node:test
│   └── utils/
│       └── math.js            # Módulo de ejemplo
├── package.json
├── .env.example
└── README.md
```

## Ejecución

Cada ejemplo se puede ejecutar individualmente:

```bash
# Usar los scripts de npm
npm run 01   # Hello World
npm run 02   # Event Loop
npm run 03   # ESM Modules
npm run 04   # FS Promises
npm run 05   # Path
npm run 06   # OS Info
npm run 07   # Crypto
npm run 08   # Process
npm run 09   # Timers
npm run 10   # HTTP Server

# O directamente con node
node src/01-hello-world.js
```

## Servidor HTTP

Para el servidor HTTP con hot reload:

```bash
# Con variables de entorno
cp .env.example .env
npm run dev

# Sin variables de entorno
node --watch src/10-http-server.js
```

Endpoints disponibles:
- `GET /` - Bienvenida
- `GET /fecha` - Fecha actual
- `GET /aleatorio` - Número aleatorio
- `GET /info` - Info del servidor
- `GET /saludar/:nombre` - Saludo personalizado
- `POST /echo` - Echo del body

## Tests

Ejecutar tests con el test runner nativo:

```bash
npm test
# o
node --test src/math.test.js
```

## Conceptos cubiertos

1. **ES Modules**: `import`/`export`, top-level await
2. **Event Loop**: Orden de ejecución, microtasks vs macrotasks
3. **Módulos nativos**: fs, path, os, crypto, http
4. **Async/Await**: Promesas, Promise.all
5. **Timers**: setTimeout, setInterval, setImmediate
6. **Testing**: node:test, node:assert
