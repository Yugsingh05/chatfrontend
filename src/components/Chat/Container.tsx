import { useChatReducer } from "@/context/ChatContext";
import { useSocketReducer } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";


const Container = ({ CallData }) => {
  const { ContextSocket } = useSocketReducer();

  const {EndCall} = useChatReducer()
  const { data } = useStateProvider();

  const [callAccepted, setCallAccepted] = useState(false);

  const endCall = () => {
    const id = CallData.id;
    
    if(CallData.callType === "voice"){
      ContextSocket.emit("reject-voice-call", {from : id});
    }else{
      ContextSocket.emit("reject-video-call", {from : id});
    }
    EndCall();

  }

  

  return (
    <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex items-center justify-center flex-col h-[100vh] text-white overflow-hidden ">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl ">{CallData.name}</span>
        <span className="text-lg">
          {callAccepted && CallData.callType !== "video"
            ? "On going call"
            : "Calling"}
        </span>
      </div>
      {(!callAccepted || CallData.callType === "audio" ) && (
          <div className="my-24 mx-auto">
          
            <Image
              src={CallData.profileImage}
              alt="profileImage"
              width={250}
              height={250}
              className="rounded-full"
            />
          </div>
        )}

        <button className="h-16 w-16 bg-red-600 mx-auto flex items-center justify-center rounded-full cursor-pointer" onClick={() => endCall() }>
            <MdOutlineCallEnd className="text-3xl cursor-pointer " />
        </button>
    </div>
  );
};

export default Container;
