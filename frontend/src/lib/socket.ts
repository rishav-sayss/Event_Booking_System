import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], autoConnect: true });
  }
  return socket;
}

export function joinEventRoom(eventId: number) {
  const s = getSocket();
  s.emit('join_event', eventId);
}

export function leaveEventRoom(eventId: number) {
  const s = getSocket();
  s.emit('leave_event', eventId);
}

export function onSeatUpdate(eventId: number, cb: (payload: { event_id: number; available_seats: number; total_seats: number }) => void) {
  const s = getSocket();
  const handler = (payload: { event_id: number; available_seats: number; total_seats: number }) => {
    if (payload.event_id === eventId) cb(payload);
  };
  s.on('seat_update', handler);
  return () => s.off('seat_update', handler);
}
