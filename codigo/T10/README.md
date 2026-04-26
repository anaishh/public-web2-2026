# T10 - WebSockets con Socket.IO

Ejemplos de código para comunicación en tiempo real.

## Estructura

```
codigo/T10/
├── src/
│   ├── config/
│   │   └── socket.js          # Configuración de Socket.IO
│   ├── handlers/
│   │   ├── chat.handler.js    # Eventos de chat
│   │   └── room.handler.js    # Eventos de salas
│   ├── middleware/
│   │   └── auth.socket.js     # Autenticación WebSocket
│   └── app.js                 # Servidor Express + Socket.IO
├── public/
│   └── index.html             # Cliente de ejemplo
└── package.json
```

## Instalación

```bash
npm install
npm run dev
```

## Conceptos demostrados

- Configuración de Socket.IO con Express
- Eventos personalizados (emit/on)
- Salas (rooms) y namespaces
- Middleware de autenticación
- Broadcasting
- Acknowledgements
