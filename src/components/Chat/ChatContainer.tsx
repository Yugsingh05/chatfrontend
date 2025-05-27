import { useChatReducer } from "@/context/ChatContext";
import { useStateProvider } from "@/context/StateContext";

import React, { useRef, useEffect } from "react";

import ChatMessage from "./ChatMessage";

export type MessageType = {
  filter: unknown;
  id: string;
  message: string;
  senderId: string;
  type: string;
  receiverId: string;
  createdAt: string;
  messageStatus: string;
};

// Separate Message component for better organization


// Empty state component
const EmptyChat = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="text-gray-400 text-center">
      <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
      <p>Select a conversation to start chatting</p>
    </div>
  </div>
);

const ChatContainer: React.FC = () => {
  const { ChatMessages, currentChatUser } = useChatReducer();
  const { data } = useStateProvider();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ChatMessages]);

  if (!currentChatUser) return <EmptyChat />;

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
     
      <div className="bg-chat-background bg-fixed h-full w-full opacity-7 fixed left-0 top-0 z-0">
        <div className="mx-10 my-6 relative bottom-0 z-20 left-0"></div>
      </div>

      <div className="flex flex-col relative z-0 h-full">
      
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!ChatMessages || ChatMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400">Start a conversation with {currentChatUser.name || 'this contact'}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {ChatMessages?.map((message : MessageType) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOutgoing={message.senderId !== currentChatUser.id}
                  userId={data?.id || ""}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;