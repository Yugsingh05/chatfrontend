import React from 'react'
import Avatar from './Avatar'
import { useStateProvider } from '@/context/StateContext';
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";

export const ChatListHeader = ({setContacts}) => {
    const {data} = useStateProvider();
  return (
    <div className='h-16 px-4 py-3 flex justify-between items-center'>

        <div className='cursor-pointer'>
            <Avatar type='sm' image={data?.profileImage} setImage={() => {}} />
        </div>
        <div className="flex gap-6">
          <BsFillChatLeftTextFill className='text-panel-header-icon text-xl cursor-pointer' title='New Chat' onClick={() => setContacts(((prev) => !prev)) }/>
          <>
          <BsThreeDotsVertical className='text-panel-header-icon text-xl cursor-pointer' title='Menu' /></>
         

        </div>
    </div>
  )
}
