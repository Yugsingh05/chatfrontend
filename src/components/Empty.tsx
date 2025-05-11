import Image from 'next/image'
import React from 'react'

  
const Empty = () => {
  return (
    <div className='border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center z-10'>
        <Image src={"/whatsapp.gif"} alt='whatsapp' width={300} height={300} />
       
    </div>
  )
}

export default Empty