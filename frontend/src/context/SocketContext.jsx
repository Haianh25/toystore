import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { API_URL } from '../config/api';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(API_URL, {
            withCredentials: true,
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server:', newSocket.id);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
