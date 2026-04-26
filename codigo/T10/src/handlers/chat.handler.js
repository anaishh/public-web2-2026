// src/handlers/chat.handler.js
// Manejador de eventos de chat

export const registerChatHandlers = (io, socket) => {
  // Enviar mensaje al chat general
  const sendMessage = (data, callback) => {
    const message = {
      id: Date.now(),
      user: socket.user?.username || 'Anónimo',
      text: data.text,
      timestamp: new Date().toISOString()
    };

    // Emitir a todos excepto al emisor
    socket.broadcast.emit('chat:message', message);

    // Acknowledgement al emisor
    if (callback) {
      callback({ success: true, messageId: message.id });
    }
  };

  // Notificar que está escribiendo
  const typing = (data) => {
    socket.broadcast.emit('chat:typing', {
      user: socket.user?.username || 'Alguien',
      isTyping: data.isTyping
    });
  };

  // Mensaje privado
  const privateMessage = (data, callback) => {
    const { toSocketId, text } = data;

    const message = {
      id: Date.now(),
      from: socket.user?.username || 'Anónimo',
      text,
      timestamp: new Date().toISOString()
    };

    // Emitir solo al destinatario
    socket.to(toSocketId).emit('chat:private', message);

    if (callback) {
      callback({ success: true, delivered: true });
    }
  };

  // Registrar eventos
  socket.on('chat:send', sendMessage);
  socket.on('chat:typing', typing);
  socket.on('chat:private', privateMessage);
};
