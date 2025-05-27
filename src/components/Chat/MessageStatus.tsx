import React from 'react'
import { BsCheck, BsCheckAll } from 'react-icons/bs'

const MessageStatus = ({status} : {status: string}) => {
  return (
   <>
   {status === "sent" && <BsCheck className='text-lg text-white'/>}
   {status === "delivered" && <BsCheckAll className='text-lg text-white'/>}
    {status === "read" && <BsCheckAll className='text-lg text-icon-ack'/>}

   </>
  )
}

export default MessageStatus