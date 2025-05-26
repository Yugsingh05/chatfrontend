"use client";
import IncomingVideoCall from "@/components/Call/IncomingVideoCall";
import IncomingVoiceCall from "@/components/Call/IncomingVoiceCall";
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
    setIncomingVideoCall,
    setIncomingVoiceCall,
    EndCall,
  } = useChatReducer();
  const [socketEvent, setSocketEvent] = useState(false);
  const {setOnlineUsers} = useChatReducer()

  const { setContextSocket } = useSocketReducer();

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

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        setIncomingVoiceCall({
          ...from,
          roomId,
          callType,
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        setIncomingVideoCall({
          ...from,
          roomId,
          callType,
        });
      });

      socket.current.on("voice-call-rejected", () => {
        EndCall();
      });

      socket.current.on("video-call-rejected", () => {
        console.log("video call rejected");
        EndCall();
      });

      socket.current.on("online-users", ({ onlineUsers }) => {
       
        setOnlineUsers(onlineUsers);
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  return (
    <>
      {Incoming_Video_Call && <IncomingVideoCall />}
      {Incoming_Voice_Call && <IncomingVoiceCall />}

      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {audioCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <AudioCall />
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
