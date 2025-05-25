import React from 'react'
import dynamic from 'next/dynamic'
import { useChatReducer } from '@/context/ChatContext'
import { useSocketReducer } from '@/context/SocketContext'
import { useStateProvider } from '@/context/StateContext'
const Container = dynamic(() => import('./Container'), { ssr: false })

const VideoCall = () => {
    const {videoCall} = useChatReducer();
    const {ContextSocket} = useSocketReducer()
    const {data} = useStateProvider()
  return (
   <Container CallData={videoCall}/>
  )
}

export default VideoCall