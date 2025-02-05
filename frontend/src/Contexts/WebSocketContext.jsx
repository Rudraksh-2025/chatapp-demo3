// src/context/WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children, userId }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL;
        const newSocket = io(backendUrl, {
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('Connected to Socket.IO server');
            // Register the user with their user ID
            newSocket.emit('register', userId);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};
