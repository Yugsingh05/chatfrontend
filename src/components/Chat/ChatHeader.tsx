import React, { useEffect, useState } from "react";
import Avatar from "../Avatar";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCall } from "react-icons/md";
import { useChatReducer } from "@/context/ChatContext";
import { user } from "@/context/StateContext";

const ChatHeader = () => {
  const {currentChatUser,setCurrentChatUser} = useChatReducer();
  const[dataOfUser,setDataOfUser] = useState<user | null>(null);
  
  useEffect(() => {console.log(currentChatUser);
    setDataOfUser(currentChatUser);
  },[currentChatUser])


  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar
          type="sm"
        image={dataOfUser?.profileImage || "/default_avatar.png"}
          setImage={() => {}}
        />
        <div className="flex flex-col">
          <span className="text-primary-strong">{dataOfUser?.name || "User"}</span>
          <span className="text-secondary text-sm">Online/offline</span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall className="text-panel-header-icon text-xl cursor-pointer" title="Call" />
        <IoVideocam className="text-panel-header-icon text-xl cursor-pointer" title="Video Call"/>
        <BiSearchAlt2 className="text-panel-header-icon text-xl cursor-pointer" title="Search" />
        <BsThreeDotsVertical className="text-panel-header-icon text-xl cursor-pointer" title="Menu" />

      </div>
    </div>
  );
};

export default ChatHeader;
