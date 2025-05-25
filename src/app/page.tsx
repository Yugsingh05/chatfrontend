"use client";
import AudioCall from "@/components/Chat/AudioCall";
import Chat from "@/components/Chat/Chat";
import MessageSearch from "@/components/Chat/MessageSearch";
import VideoCall from "@/components/Chat/VideoCall";
import ChatList from "@/components/ChatList";
import Empty from "@/components/Empty";
import { useChatReducer } from "@/context/ChatContext";
import { useSocketReducer } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

export default function Home() {
  const { data } = useStateProvider();
  const {
    currentChatUser,
    setChatMessages,
    searchMessages,
    videoCall,
    audioCall,
    Incoming_Video_Call,
    Incoming_Voice_Call,
  } = useChatReducer();
  const [socketEvent, setSocketEvent] = useState(false);

  const { ContextSocket, setContextSocket } = useSocketReducer();

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (data) {
      socket.current = io(HOST);
      socket.current.emit("add-user", data.id);
      setContextSocket(socket.current);
      setSocketEvent(false);
    }
  }, [data]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-receive", (data) => {
        console.log(data);
        setChatMessages((prev) => [...prev, data.message]);
      });
    }
  }, [socket.current]);

  return (
    <>
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
         <VideoCall/>
        </div>
      )}
      {audioCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
         <AudioCall/>
        </div>
      )}
      {!videoCall && !audioCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-screen overflow-hidden">
          <ChatList contact={currentChatUser} />
          {/* <Empty /> */}
          {currentChatUser ? (
            <div
              className={searchMessages ? "grid grid-cols-2" : "grid-cols-2"}
            >
              <Chat />
              {searchMessages && <MessageSearch />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}
