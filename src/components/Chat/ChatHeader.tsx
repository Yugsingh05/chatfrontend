import React from "react";
import Avatar from "../Avatar";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCall } from "react-icons/md";

const ChatHeader = () => {
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar
          type="sm"
          image="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          setImage={() => {}}
        />
        <div className="flex flex-col">
          <span className="text-primary-strong">Demo</span>
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
