import { useChatReducer } from "@/context/ChatContext";
import { useSocketReducer } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";


const Container = ({ CallData }) => {
  const { ContextSocket } = useSocketReducer();

  const { data } = useStateProvider();
  const {EndCall} = useChatReducer();
  const [callAccepted, setCallAccepted] = useState(false);

  console.log(CallData);

  

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

        <button className="h-16 w-16 bg-red-600 mx-auto flex items-center justify-center rounded-full cursor-pointer" onClick={() => EndCall() }>
            <MdOutlineCallEnd className="text-3xl cursor-pointer " />
        </button>
    </div>
  );
};

export default Container;
