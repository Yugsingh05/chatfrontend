import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useChatReducer } from '@/context/ChatContext'
import { useSocketReducer } from '@/context/SocketContext'
import { useStateProvider } from '@/context/StateContext'
const Container = dynamic(() => import('./Container'), { ssr: false })

const VideoCall = () => {
    const {videoCall,EndCall} = useChatReducer();
    const {ContextSocket} = useSocketReducer()
    const {data} = useStateProvider();

    useEffect(() => {
        if (videoCall.type === "out-going") {
          ContextSocket.emit("outgoing-video-call", {
            to : videoCall.id,
            from : data,
            name : videoCall.name,
            callType : videoCall.callType,
            roomId : videoCall.roomId,
          });
        }
          },
       [videoCall])

  return (
   <Container CallData={videoCall}/>
  )
}

export default VideoCall