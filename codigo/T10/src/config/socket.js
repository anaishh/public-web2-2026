// src/config/socket.js
// Configuración de Socket.IO

import { Server } from 'socket.io';

export const configureSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    },
    // Opciones de conexión
    pingTimeout: 60000,
    pingInterval: 25000
  });

  return io;
};

// Utilidades para emitir eventos
export const emitToRoom = (io, room, event, data) => {
  io.to(room).emit(event, data);
};

export const emitToAll = (io, event, data) => {
  io.emit(event, data);
};

export const emitToUser = (io, socketId, event, data) => {
  io.to(socketId).emit(event, data);
};
