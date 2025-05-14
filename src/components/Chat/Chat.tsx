import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";
import { useChatReducer } from "@/context/ChatContext";
import axios from "axios";
import { GET_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";

const Chat = () => {

   const {currentChatUser} = useChatReducer();
   const { data } = useStateProvider();

   useEffect(() => {

    async function getData() {

      try {

        const res = await axios.get(GET_MESSAGES_ROUTE.replace(":senderId", currentChatUser?.id || "").replace(":receiverId", data?.id || ""));

        console.log(res.data);
        
      } catch (error) {
        console.log(error)
      }
      
    }
    if(currentChatUser) getData()
   }
   

    ,[currentChatUser])
  return (
    <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-[100vh] border-b-4 border-b-icon-green ">
        <ChatHeader/>
        <ChatContainer/>
        <MessageBar/>

    </div>
  );
};

export default Chat;
