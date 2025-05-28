import { useChatReducer } from "@/context/ChatContext";
import { useSocketReducer } from "@/context/SocketContext";
import Image from "next/image";
import React from "react";

const IncomingVideoCall = () => {
  const { Incoming_Video_Call, setVideoCall, setIncomingVideoCall ,EndCall} =
    useChatReducer();
  const { ContextSocket } = useSocketReducer();

  const acceptCall = () => {
    console.log("Incoming_Video_Call", Incoming_Video_Call);
    if (Incoming_Video_Call && typeof Incoming_Video_Call === "object") {
      setVideoCall({ ...Incoming_Video_Call, type: "in-coming" });
    }

    ContextSocket?.emit("accept-incoming-call", { id: Incoming_Video_Call?.id });
    setIncomingVideoCall(undefined);
  };

  const rejectCall = () => {
   
    ContextSocket?.emit("reject-video-call", {from : Incoming_Video_Call?.id});
    EndCall();
    
  };

  return (
    <div className="h-24 w-80 fixed bottom-8 mb-8 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
      <div className="">
        <Image
          src={Incoming_Video_Call?.profileImage || ""}
          alt="profileImage"
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>

      <div>
        <div> {Incoming_Video_Call?.name}</div>
        <div className="text-xs">Incoming Video Call</div>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 p-1 px-3 text-sm rounded-full cursor-pointer"
            onClick={rejectCall}
          >
            Reject
          </button>

          <button
            className="bg-green-500 p-1 px-3 text-sm rounded-full cursor-pointer"
            onClick={acceptCall}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingVideoCall;
