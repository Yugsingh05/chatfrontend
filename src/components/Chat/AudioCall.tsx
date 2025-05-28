import { useChatReducer } from '@/context/ChatContext';
import { useSocketReducer } from '@/context/SocketContext';
import { useStateProvider } from '@/context/StateContext';

import dynamic from 'next/dynamic';
const Container = dynamic(() => import('./Container'), { ssr: false });

import React, { useEffect } from 'react'

const AudioCall = () => {
       const {audioCall} = useChatReducer();
    const {ContextSocket} = useSocketReducer()
    const {data} = useStateProvider();


    useEffect(() => {
        if (audioCall && audioCall.type === "out-going") {
          ContextSocket.emit("outgoing-voice-call", {
            to : audioCall.id,
            from : data,
            name : audioCall.name,
            callType : audioCall.callType,
            roomId : audioCall.roomId,
          });
        }
          },
       [audioCall])

       if(!audioCall) return null
  return (
   <Container CallData={audioCall}/>
  )
}

export default AudioCall