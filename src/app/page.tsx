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
    setOnlineUsers,
  } = useChatReducer();

  const { setContextSocket } = useSocketReducer();

  const socket = useRef<Socket | null>(null);
  const [socketEvent, setSocketEvent] = useState(false);

  // 🔁 Refs to keep latest values
  const currentChatUserRef = useRef(currentChatUser);
  const dataRef = useRef(data);

  useEffect(() => {
    currentChatUserRef.current = currentChatUser;
    dataRef.current = data;
  }, [currentChatUser, data]);

  useEffect(() => {
    if (data) {
      socket.current = io(HOST);
      socket.current.emit("add-user", data.id);
      setContextSocket(socket.current);
      setSocketEvent(false);
    }
  }, [data,setContextSocket]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      const sock = socket.current;

      // 📨 Message Received
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
        } else {
          console.warn("Socket not connected or condition not met");
        }
      });

      // 📞 Call Events
      sock.on("incoming-voice-call", ({ from, roomId, callType }) => {
        setIncomingVoiceCall({ ...from, roomId, callType });
      });

      sock.on("incoming-video-call", ({ from, roomId, callType }) => {
        setIncomingVideoCall({ ...from, roomId, callType });
      });

      sock.on("voice-call-rejected", () => {
        EndCall();
      });

      sock.on("video-call-rejected", () => {
        console.log("Video call rejected");
        EndCall();
      });

      // ✅ Online Users
      sock.on("online-users", ({ onlineUsers }) => {
        setOnlineUsers(onlineUsers);
      });

      // ✅ Mark Message As Read
      sock.on("mark-as-read", ({ userId, success }) => {
        console.log("Mark as read:", userId, success);
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
    console.log("Emitting mark-as-read-by-receiver");

    socket.current.emit("mark-as-read-by-receiver", {
      userId: data.id, // receiver (current logged-in user)
      senderId: currentChatUser.id, // the person you're chatting with
    });
  }
}, [currentChatUser, data?.id]);

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
          <ChatList  />
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
