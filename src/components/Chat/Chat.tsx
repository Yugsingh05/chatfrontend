import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";
import { useChatReducer } from "@/context/ChatContext";
import axios from "axios";
import { GET_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";
import { LoaderCircle } from "lucide-react";

const Chat = () => {

   const {currentChatUser , setChatMessages} = useChatReducer();
   const { data } = useStateProvider();
   const [loading, setLoading] = useState(false);

   useEffect(() => {
    async function getData() {
      try {
        setLoading(true);

        const res = await axios.get(GET_MESSAGES_ROUTE.replace(":senderId", currentChatUser?.id || "").replace(":receiverId", data?.id || ""));

        setChatMessages(res.data.msg);

        console.log(res.data.msg); 
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false);
      }
    }
    if(currentChatUser) getData()
   }
   

    ,[currentChatUser])


    if(loading) return <div className="flex items-center justify-center h-[100vh] bg-conversation-panel-background">
      <LoaderCircle className="mx-auto my-auto text-icon-green  animate-spin" size={50}/>

    </div>
    
  return (
    <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-[100vh] border-b-4 border-b-icon-green ">
        <ChatHeader/>
        <ChatContainer/>
        <MessageBar/>

    </div>
  );
};

export default Chat;
