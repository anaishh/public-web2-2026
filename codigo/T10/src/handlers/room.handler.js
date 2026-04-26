// src/handlers/room.handler.js
// Manejador de eventos de salas

// Almacén de salas activas
const rooms = new Map();

export const registerRoomHandlers = (io, socket) => {
  // Unirse a una sala
  const joinRoom = (data, callback) => {
    const { roomId, roomName } = data;
    const username = socket.user?.username || 'Anónimo';

    // Unirse a la sala
    socket.join(roomId);

    // Actualizar lista de usuarios en la sala
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        name: roomName || roomId,
        users: new Set()
      });
    }
    rooms.get(roomId).users.add(socket.id);

    // Notificar a la sala
    socket.to(roomId).emit('room:userJoined', {
      user: username,
      roomId
    });

    // Enviar confirmación
    if (callback) {
      callback({
        success: true,
        usersCount: rooms.get(roomId).users.size
      });
    }

    console.log(`${username} se unió a la sala ${roomId}`);
  };

  // Salir de una sala
  const leaveRoom = (data) => {
    const { roomId } = data;
    const username = socket.user?.username || 'Anónimo';

    socket.leave(roomId);

    // Actualizar lista
    if (rooms.has(roomId)) {
      rooms.get(roomId).users.delete(socket.id);

      // Eliminar sala si está vacía
      if (rooms.get(roomId).users.size === 0) {
        rooms.delete(roomId);
      }
    }

    // Notificar a la sala
    socket.to(roomId).emit('room:userLeft', {
      user: username,
      roomId
    });

    console.log(`${username} salió de la sala ${roomId}`);
  };

  // Enviar mensaje a una sala
  const roomMessage = (data) => {
    const { roomId, text } = data;

    const message = {
      id: Date.now(),
      user: socket.user?.username || 'Anónimo',
      text,
      roomId,
      timestamp: new Date().toISOString()
    };

    // Emitir a todos en la sala (incluido el emisor)
    io.to(roomId).emit('room:message', message);
  };

  // Obtener salas activas
  const getRooms = (callback) => {
    const roomsList = Array.from(rooms.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      usersCount: data.users.size
    }));

    if (callback) {
      callback(roomsList);
    }
  };

  // Limpiar al desconectar
  const handleDisconnect = () => {
    rooms.forEach((data, roomId) => {
      if (data.users.has(socket.id)) {
        data.users.delete(socket.id);
        socket.to(roomId).emit('room:userLeft', {
          user: socket.user?.username || 'Anónimo',
          roomId
        });
      }
    });
  };

  // Registrar eventos
  socket.on('room:join', joinRoom);
  socket.on('room:leave', leaveRoom);
  socket.on('room:message', roomMessage);
  socket.on('room:list', getRooms);
  socket.on('disconnect', handleDisconnect);
};
