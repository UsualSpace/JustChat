import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket_context = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, SetSocket] = useState(null);

    useEffect(() => {
        const new_socket = io("http://localhost:4000");

        SetSocket(new_socket);

        return () => {
            new_socket.disconnect(); // Cleanup on unmount
        };
    }, []);

    return (
        <socket_context.Provider value={socket}>
            {children}
        </socket_context.Provider>
    );
};

export const UseSocket = () => {
    return useContext(socket_context);
};
