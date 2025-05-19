"use client";
import { createContext, useContext, useState } from "react";
import { user } from "./StateContext";
import { MessageType } from "@/components/Chat/ChatContainer";

const ChatContext = createContext({});

const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [ChatMessages, setChatMessages] = useState([]);
  const [searchMessages,setSearchMessages] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        currentChatUser,
        setCurrentChatUser,
        ChatMessages,
        setChatMessages,
        searchMessages,
        setSearchMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatReducer = () : {currentChatUser : user, setCurrentChatUser : React.Dispatch<React.SetStateAction<user>>, ChatMessages : MessageType, setChatMessages : React.Dispatch<React.SetStateAction<MessageType>>, searchMessages : boolean, setSearchMessages : React.Dispatch<React.SetStateAction<boolean>>} => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatReducer must be used within a ChatContextProvider");
  }
  return context;
};

export { ChatContextProvider, useChatReducer };
