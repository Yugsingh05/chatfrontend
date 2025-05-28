"use client";

import { createContext, useContext, useState } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
  ContextSocket: Socket | null;
  setContextSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ContextSocket, setContextSocket] = useState<Socket | null>(null);

  return (
    <SocketContext.Provider value={{ ContextSocket, setContextSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketReducer = (): {
  ContextSocket: Socket | null;
  setContextSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
} => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketReducer must be used within a SocketContextProvider"
    );
  }
  return context;
};
