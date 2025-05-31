import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useChatReducer } from '@/context/ChatContext'
import { useSocketReducer } from '@/context/SocketContext'
import { useStateProvider } from '@/context/StateContext'
const Container = dynamic(() => import('./Container'), { ssr: false })

const VideoCall = () => {
    const {videoCall} = useChatReducer();
    const {ContextSocket} = useSocketReducer()
    const {data} = useStateProvider();

    useEffect(() => {
        if ( videoCall && videoCall.type === "out-going") {

          console.error(videoCall);
          ContextSocket?.emit("outgoing-video-call", {
            to : videoCall.id,
            from : data,
            name : videoCall.name,
            callType : videoCall.callType,
            roomId : videoCall.roomId,
          });
        }
          },
       [videoCall, ContextSocket, data])

       if(!videoCall) return null
  return (
   <Container CallData={videoCall}/>
  )
}

export default VideoCall