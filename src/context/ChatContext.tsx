"use client";
import { createContext, useContext, useState } from "react";

const ChatContext = createContext({});

const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [ChatMessages, setChatMessages] = useState([]);

  return (
    <ChatContext.Provider
      value={{
        currentChatUser,
        setCurrentChatUser,
        ChatMessages,
        setChatMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatReducer = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatReducer must be used within a ChatContextProvider");
  }
  return context;
};

export { ChatContextProvider, useChatReducer };
