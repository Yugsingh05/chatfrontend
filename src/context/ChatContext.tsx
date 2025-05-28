"use client";
import { createContext, useContext, useState } from "react";
import { user } from "./StateContext";
import { MessageType } from "@/components/Chat/ChatContainer";



type ContactUserType = {
  about: string;
  createdAt: string;
  email: string;
  id: string;
  message: string;
  messageId: string;
  messageStatus: string;
  name: string;
  profileImage: string;
  receiverId: string;
  senderId: string;
  totalUnreadMessages: number;
  type: string;
};

export type IncomingCall = {
  id: string;
  name: string;
  profileImage: string;
  callType: "audio" | "video";
  type: "in-coming" | "out-going";
  roomId: number;
}

export type Call = {
  id : string;
  name : string;
  profileImage : string;
  callType : "audio" | "video";
  type : "in-coming" | "out-going";
  roomId : number;
}


type ChatContextType = {
  currentChatUser: user | undefined;
  setCurrentChatUser: React.Dispatch<React.SetStateAction<user | undefined>>;
  ChatMessages: MessageType[];
  setChatMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  searchMessages: boolean;
  setSearchMessages: React.Dispatch<React.SetStateAction<boolean>>;
  userContacts: ContactUserType[];
  setUserContacts: React.Dispatch<React.SetStateAction<ContactUserType[]>>;
  onlineUsers: string[];
  setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
  searchedUsers: string;
  setSearchedUsers: React.Dispatch<React.SetStateAction<string>>;
  videoCall: Call | undefined;
  setVideoCall: React.Dispatch<React.SetStateAction<Call | undefined>>;
  audioCall: Call | undefined;
  setAudioCall: React.Dispatch<React.SetStateAction<Call | undefined>>;
  EndCall: () => void;
  Incoming_Voice_Call: IncomingCall | undefined;
  setIncomingVoiceCall: React.Dispatch<React.SetStateAction<IncomingCall | undefined>>;
  Incoming_Video_Call: IncomingCall | undefined;
  setIncomingVideoCall: React.Dispatch<React.SetStateAction<IncomingCall | undefined>>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentChatUser, setCurrentChatUser] = useState<user | undefined>(undefined);
  const [ChatMessages, setChatMessages] = useState<MessageType[]>([]);
  const [searchMessages, setSearchMessages] = useState(false);
  const [userContacts, setUserContacts] = useState<ContactUserType[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<string>("");
  const [videoCall, setVideoCall] = useState<Call | undefined>(undefined);
  const [audioCall, setAudioCall] = useState<Call | undefined>(undefined);

  const [Incoming_Voice_Call, setIncomingVoiceCall] = useState<IncomingCall | undefined>(undefined);
  const [Incoming_Video_Call, setIncomingVideoCall] = useState<IncomingCall | undefined>(undefined);

  const EndCall = () => {
    setVideoCall(undefined);
    setAudioCall(undefined);
    setIncomingVoiceCall(undefined);
    setIncomingVideoCall(undefined);
    
  };

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
        setSearchedUsers,
        videoCall,
        setVideoCall,
        audioCall,
        setAudioCall,
        EndCall,
        Incoming_Voice_Call,
        setIncomingVoiceCall,
        Incoming_Video_Call,
        setIncomingVideoCall,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatReducer = (): {
  currentChatUser: user | undefined;
  setCurrentChatUser: React.Dispatch<React.SetStateAction<user | undefined>>;
  ChatMessages: MessageType[];
  setChatMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  searchMessages: boolean;
  setSearchMessages: React.Dispatch<React.SetStateAction<boolean>>;
  userContacts: ContactUserType[];
  setUserContacts: React.Dispatch<React.SetStateAction<ContactUserType[]>>;
  onlineUsers: string[];
  setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
  searchedUsers: string;
  setSearchedUsers: React.Dispatch<React.SetStateAction<string>>;
  videoCall: Call | undefined;
  setVideoCall: React.Dispatch<React.SetStateAction<Call | undefined>>;
  audioCall: Call | undefined;
  setAudioCall: React.Dispatch<React.SetStateAction<Call | undefined>>;
  EndCall: () => void;
  Incoming_Voice_Call: IncomingCall | undefined;
  setIncomingVoiceCall: React.Dispatch<React.SetStateAction<IncomingCall | undefined>>;
  Incoming_Video_Call: IncomingCall | undefined;
  setIncomingVideoCall: React.Dispatch<React.SetStateAction<IncomingCall | undefined>>;
} => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatReducer must be used within a ChatContextProvider");
  }
  return context;
};

export { ChatContextProvider, useChatReducer };
