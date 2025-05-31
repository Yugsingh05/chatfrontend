"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
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
    setOnlineUsers,
  } = useChatReducer();
  const { setContextSocket } = useSocketReducer();

  const socket = useRef<Socket | null>(null);
  const [socketEvent, setSocketEvent] = useState(false);

  // Mobile navigation state
  const [mobileView, setMobileView] = useState<"chatlist" | "chat" | "search">("chatlist");

  const currentChatUserRef = useRef(currentChatUser);
  const dataRef = useRef(data);

  useEffect(() => {
    currentChatUserRef.current = currentChatUser;
    dataRef.current = data;

    if (window.innerWidth < 768) {
      setMobileView(currentChatUser ? "chat" : "chatlist");
    }
  }, [currentChatUser, data]);

  useEffect(() => {
    if (data) {
      socket.current = io(HOST, {
        withCredentials: true,
        transports: ["websocket"],
      });
      socket.current.emit("add-user", data.id);
      setContextSocket(socket.current);
      setSocketEvent(false);
    }
  }, [data, setContextSocket]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      const sock = socket.current;

      sock.on("msg-receive", (mess) => {
        setChatMessages((prev) => [...prev, mess.message]);
        const currentChat = currentChatUserRef.current;
        const userData = dataRef.current;

        if (
          sock.connected &&
          userData?.id === mess.message.receiverId &&
          currentChat?.id === mess.message.senderId
        ) {
          sock.emit("mark-as-read-by-receiver", {
            userId: userData.id,
            senderId: currentChat?.id,
          });
        }
      });

      sock.on("incoming-voice-call", ({ from, roomId, callType }) => {
        setIncomingVoiceCall({ ...from, roomId, callType });
      });

      sock.on("incoming-video-call", ({ from, roomId, callType }) => {
        console.log("incoming-video-call", { from, roomId, callType });
        setIncomingVideoCall({ ...from, roomId, callType });
      });

      sock.on("voice-call-rejected", EndCall);
      sock.on("video-call-rejected", EndCall);

      sock.on("online-users", ({ onlineUsers }) => {
        setOnlineUsers(onlineUsers);
      });

      sock.on("mark-as-read", ({ success }) => {
        if (success) {
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.messageStatus !== "read"
                ? { ...msg, messageStatus: "read" }
                : msg
            )
          );
        }
      });

      setSocketEvent(true);
    }
  }, [
    socketEvent,
    setChatMessages,
    setIncomingVoiceCall,
    setIncomingVideoCall,
    EndCall,
    setOnlineUsers,
  ]);

  useEffect(() => {
    if (
      socket.current &&
      socket.current.connected &&
      currentChatUser &&
      data?.id
    ) {
      socket.current.emit("mark-as-read-by-receiver", {
        userId: data.id,
        senderId: currentChatUser.id,
      });
    }
  }, [currentChatUser, data?.id]);

  return (
    <>
      {Incoming_Video_Call && <IncomingVideoCall />}
      {Incoming_Voice_Call && <IncomingVoiceCall />}
      {videoCall && (
        <div className="h-screen w-screen overflow-hidden">
          <VideoCall />
        </div>
      )}
      {audioCall && (
        <div className="h-screen w-screen overflow-hidden">
          <AudioCall />
        </div>
      )}

     {!videoCall && !audioCall && (
        <div className="h-screen w-full overflow-hidden">
          {/* Desktop layout */}
          <div className="hidden md:grid grid-cols-main h-full w-full">
            <ChatList 
            />
            {currentChatUser ? (
              <div className={searchMessages ? "grid grid-cols-2" : "grid-cols-2"}>
                <Chat   onSearchClick={() => {}}/>
                {searchMessages && <MessageSearch />}
              </div>
            ) : (
              <Empty />
            )}
          </div>

          {/* Mobile layout */}
          <div className="block md:hidden h-full w-full">
            {mobileView === "chatlist" && (
              <ChatList
                onChatSelect={() => setMobileView("chat")}
                
              />
            )}
            {mobileView === "chat" && (
              <div className="relative h-full">
                <button
                  className="absolute top-2 left-2 z-10 bg-white px-3 py-1 rounded shadow"
                  onClick={() => setMobileView("chatlist")}
                >
                  ← Back
                </button>
                <Chat 
                  onSearchClick={() => setMobileView("search")} // e.g., a search button inside chat UI
                />
              </div>
            )}
            {mobileView === "search" && (
              <div className="relative h-full">
                {/* Pass onClose to switch back to chat or chatlist */}
                <MessageSearch onClose={() => setMobileView(currentChatUser ? "chat" : "chatlist")} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
