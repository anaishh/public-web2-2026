// src/app.js
// Servidor Express con Socket.IO

import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { configureSocket } from './config/socket.js';
import { authMiddleware, generateToken } from './middleware/auth.socket.js';
import { registerChatHandlers } from './handlers/chat.handler.js';
import { registerRoomHandlers } from './handlers/room.handler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = configureSocket(httpServer);

// Servir archivos estáticos
app.use(express.static(join(__dirname, '../public')));
app.use(express.json());

// Endpoint para obtener token de prueba
app.post('/api/token', (req, res) => {
  const { username } = req.body;
  const token = generateToken(Date.now(), username || 'Usuario');
  res.json({ token });
});

// ==================== SOCKET.IO ====================

// Middleware de autenticación (opcional, comentar para pruebas)
// io.use(authMiddleware);

// Conexión de cliente
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  // Registrar handlers
  registerChatHandlers(io, socket);
  registerRoomHandlers(io, socket);

  // Evento de desconexión
  socket.on('disconnect', (reason) => {
    console.log(`Cliente desconectado: ${socket.id} - ${reason}`);
  });

  // Manejo de errores
  socket.on('error', (error) => {
    console.error('Error de socket:', error);
  });
});

// ==================== NAMESPACE EJEMPLO ====================

const adminNamespace = io.of('/admin');

adminNamespace.use(authMiddleware);

adminNamespace.on('connection', (socket) => {
  console.log(`Admin conectado: ${socket.user.username}`);

  socket.on('admin:broadcast', (message) => {
    // Broadcast a todos los clientes del namespace principal
    io.emit('system:announcement', {
      from: 'Admin',
      message,
      timestamp: new Date().toISOString()
    });
  });
});

// ==================== SERVIDOR ====================

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
