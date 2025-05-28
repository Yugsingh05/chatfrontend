import { useChatReducer } from '@/context/ChatContext';
import { useSocketReducer } from '@/context/SocketContext';
import Image from 'next/image'
import React from 'react'

const IncomingVoiceCall = () => {

     const { Incoming_Voice_Call, setAudioCall, setIncomingVoiceCall ,EndCall} =
    useChatReducer();
  const { ContextSocket } = useSocketReducer();

  const acceptCall = () => {
    if(Incoming_Voice_Call) setAudioCall({ ...Incoming_Voice_Call, type: "in-coming" });

    ContextSocket?.emit("accept-incoming-call", { id: Incoming_Voice_Call?.id });
    setIncomingVoiceCall(undefined);
  };

  const rejectCall = () => {
   
    ContextSocket?.emit("reject-voice-call", {from : Incoming_Voice_Call?.id});
    EndCall();
    
  };

  return (
    <div className="h-24 w-80 fixed bottom-8 mb-8 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
         <div className="">
           <Image
             src={Incoming_Voice_Call?.profileImage || ""}
             alt="profileImage"
             width={50}
             height={50}
             className="rounded-full"
           />
         </div>
   
         <div>
           <div> {Incoming_Voice_Call?.name}</div>
           <div className="text-xs">Incoming voice Call</div>
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
  )
}

export default IncomingVoiceCall