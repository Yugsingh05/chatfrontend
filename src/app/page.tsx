"use client";
import Chat from "@/components/Chat/Chat";
import ChatList from "@/components/ChatList";
import Empty from "@/components/Empty";
import { useChatReducer } from "@/context/ChatContext";
import { useSocketReducer } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const { data, setData } = useStateProvider();
  const router = useRouter();
  const {currentChatUser,setChatMessages} = useChatReducer();
  const [socketEvent,setSocketEvent] = useState(false);

  const {ContextSocket,setContextSocket} = useSocketReducer();

  const socket = useRef();

  useEffect(() => {

    if(data){
      socket.current = io(HOST);
      socket.current.emit("add-user",data.id);
      setContextSocket(socket.current);
    }

  },[data])

  useEffect(() => {
    if(socket.current && !socketEvent){
      socket.current.on("msg-receive", (data) => {
        console.log(data)
        setChatMessages((prev) => [...prev, data.message]);
      })
    }
  },[socket.current])

  

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ChatList />
      {/* <Empty /> */}
      {currentChatUser ? <Chat /> : <Empty />}
    </div>
  );
}
