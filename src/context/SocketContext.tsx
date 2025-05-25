"use client";

import { createContext, useContext, useState } from "react";
import { Socket } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [ContextSocket, setContextSocket] = useState();


    return <SocketContext.Provider value={{ContextSocket,setContextSocket}}>{children}</SocketContext.Provider>;
};


export const useSocketReducer = () : {ContextSocket : Socket, setContextSocket : React.Dispatch<React.SetStateAction<Socket>>} => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocketReducer must be used within a SocketContextProvider");
    }
    return context;
}