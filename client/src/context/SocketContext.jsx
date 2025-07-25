import socketio from "socket.io-client";
import { LocalStorage } from "../utils"
import { createContext, useContext, useEffect, useState } from "react";


const getSocket = () => {
    const token = LocalStorage.get("token");

    const URI = "http://localhost:5000"
    return socketio(URI, {
        withCredentials: true,
        auth: {token},
    });

};

// creating context for socket

const SocketContext = createContext({
    socket: null,
});

const useSocket = () => useContext(SocketContext);

const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(getSocket());
    }, []);

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, useSocket };