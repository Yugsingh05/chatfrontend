import React from 'react'
import Avatar from './Avatar'
import { useStateProvider } from '@/context/StateContext';

export const ChatListHeader = () => {
    const {data} = useStateProvider();
  return (
    <div className='h-16 px-4 py-3 flex justify-between items-center'>

        <div className='cursor-pointer'>
            <Avatar type='sm' image={data?.profileImage} />
        </div>
        <div className="flex"></div>
    </div>
  )
}
