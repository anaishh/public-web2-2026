# T11 - Deploy y DevOps

Ejemplos de configuración para Docker, docker-compose y CI/CD.

## Estructura

```
codigo/T11/
├── src/
│   ├── config/
│   │   └── index.js           # Variables de entorno
│   ├── routes/
│   │   └── health.routes.js   # Health checks
│   └── app.js                 # Servidor Express
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── package.json
```

## Uso con Docker

```bash
# Construir imagen
docker build -t mi-api .

# Ejecutar contenedor
docker run -p 3000:3000 mi-api

# Con docker-compose
docker-compose up -d
```

## Conceptos demostrados

- Dockerfile multi-stage
- Docker Compose con múltiples servicios
- Variables de entorno
- Health checks
- GitHub Actions CI/CD
- Buenas prácticas de containerización
