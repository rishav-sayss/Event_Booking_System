let ioInstance = null;

function initSocket(server, corsOrigin) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
  });

  ioInstance.on('connection', (socket) => {
    socket.on('join_event', (eventId) => {
      socket.join(`event_${eventId}`);
    });
    socket.on('leave_event', (eventId) => {
      socket.leave(`event_${eventId}`);
    });
  });

  return ioInstance;
}

function emitSeatUpdate(eventId, payload) {
  if (!ioInstance) return;
  ioInstance.to(`event_${eventId}`).emit('seat_update', payload);
}

function getIo() {
  return ioInstance;
}

module.exports = { initSocket, emitSeatUpdate, getIo };
