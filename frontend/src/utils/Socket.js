import { io } from 'socket.io-client';
export const socket = io(import.meta.env.VITE_QB_SOCKET_API, {
    transports: ['websocket'],
});
