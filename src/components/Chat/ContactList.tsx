import { useChatReducer } from '@/context/ChatContext';
import { GET_ALL_CONTACTS_ROUTE } from '@/utils/ApiRoutes';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi';
import { BsFilter } from 'react-icons/bs';

const ContactList = ({setIsAllContacts}) => {
  const [allContacts,setAllContacts] = useState([]);

  const {currentChatUser,setCurrentChatUser} = useChatReducer();

  useEffect(() => {
    const getContacts = async () =>{
      try {
        const res = await axios.get(GET_ALL_CONTACTS_ROUTE);
        console.log(res.data);
        setAllContacts(res.data.data);
      } catch (error) {
        console.error(error);
      }
    }

    getContacts();
  },[])

   const handleClick = ({user}) => {
    console.log(user);
    setCurrentChatUser(user);

   }
  return (
    <div className='h-full flex flex-col'>
      <div className="h-24 flex items-end px-3 py-12">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack className='cursor-pointer text-xl'
          onClick={() => {
            setIsAllContacts(true);
          }}/>
          <span>New Chat</span>
        </div>
      </div>

          <div className="bg-search-input-container-background flex -my-8 pl-5 items-center gap-3 h-14">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2
                  className="text-panel-header-icon text-xl cursor-pointer"
                  title="Search"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search or start a new chat"
                  className="bg-transparent text-sm focus:outline-none text-white w-full"
                />
              </div>
            </div>
            <div className="pr-5 pl-3">
              <BsFilter className="text-panel-header-icon text-lg cursor-pointer"/>
      
            </div>
          </div>


          <div className='flex flex-col overflow-y-scroll h-full mt-5'>
            {
             allContacts && Object.entries(allContacts).map(([initialLetter,contact]) => {
                return (<div key={contact.id+initialLetter}>
                  <div className='text-teal-light pl-10 py-5 '>{initialLetter}</div>
                  {
                    contact.map((contact) => {
                      return (<div key={contact.id} className='px-10 py-2 flex items-center gap-5 hover:bg-panel-header-background cursor-pointer' onClick={() => handleClick({user:contact})}>
                        <div className='flex items-center gap-3'>
                          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-panel-header-icon'>
                            <Image src={contact.profileImage} width={40} height={40} alt='profileImage'/>
                          </div>
                          <div className='flex flex-col'>
                            <span className='text-primary-strong'>{contact.name}</span>
                            <span className='text-secondary text-sm'>{contact.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      )
                    })
                  }
                </div>)
                })
              }
            
            
          </div>

    </div>
  )
}

export default ContactList