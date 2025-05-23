"use client";
import { createContext, useContext, useState } from "react";
import { user } from "./StateContext";
import { MessageType } from "@/components/Chat/ChatContainer";

const ChatContext = createContext({});

const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [ChatMessages, setChatMessages] = useState([]);
  const [searchMessages, setSearchMessages] = useState(false);
  const [userContacts, setUserContacts] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<string>("");

  return (
    <ChatContext.Provider
      value={{
        currentChatUser,
        setCurrentChatUser,
        ChatMessages,
        setChatMessages,
        searchMessages,
        setSearchMessages,
        userContacts,
        setUserContacts,
        onlineUsers,
        setOnlineUsers,
        searchedUsers,
        setSearchedUsers
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatReducer = (): {
  currentChatUser: user;
  setCurrentChatUser: React.Dispatch<React.SetStateAction<user>>;
  ChatMessages: MessageType;
  setChatMessages: React.Dispatch<React.SetStateAction<MessageType>>;
  searchMessages: boolean;
  setSearchMessages: React.Dispatch<React.SetStateAction<boolean>>;
  userContacts: user[];
  setUserContacts: React.Dispatch<React.SetStateAction<user[]>>;
  onlineUsers: string[];
  setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
  searchedUsers: string;
  setSearchedUsers: React.Dispatch<React.SetStateAction<string>>;
} => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatReducer must be used within a ChatContextProvider");
  }
  return context;
};

export { ChatContextProvider, useChatReducer };
