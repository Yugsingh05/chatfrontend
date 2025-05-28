import React, { useEffect, useState } from "react";
import Avatar from "../Avatar";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdCall } from "react-icons/md";
import { useChatReducer } from "@/context/ChatContext";
import { user } from "@/context/StateContext";
import ContextMenu from "../ContextMenu";

const ChatHeader = () => {
  const { currentChatUser, setSearchMessages, setVideoCall, setAudioCall ,setCurrentChatUser,EndCall , onlineUsers} =
    useChatReducer();
  const [dataOfUser, setDataOfUser] = useState<user | undefined>(undefined);
  const [contextmenuCoordinates, setContextmenuCoordinates] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [contextmenuVisible, setContextmenuVisible] = useState(false);

  useEffect(() => {
    console.log(currentChatUser);
    setDataOfUser(currentChatUser);
  }, [currentChatUser]);

  const handleVoiceCall = () => {
    if (!currentChatUser?.id) return;
    setAudioCall({
      ...currentChatUser,
      id: currentChatUser.id,
      type: "out-going",
      callType: "audio",
      roomId: Date.now(),
    });
  };

  const handleVideoCall = () => {

    if(currentChatUser)  setVideoCall({
      ...currentChatUser,
      id: currentChatUser.id,
      type: "out-going",
      callType: "video",
      roomId: Date.now(),
    });
  };

  const ContextMenuOptions = [
    {
      name: "Exit",
      callback : () => {
        setCurrentChatUser(undefined);
        EndCall();
        setContextmenuVisible(false);
      }
    }
  ]

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextmenuCoordinates({ x: event.clientX - 70, y: event.clientY+20 });
    setContextmenuVisible(true);
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar
          type="sm"
          image={dataOfUser?.profileImage || "/default_avatar.png"}
          setImage={() => {}}
        />
        <div className="flex flex-col">
          <span className="text-primary-strong">
            {dataOfUser?.name || "User"}
          </span>
          <span className="text-secondary text-sm">{
          onlineUsers.includes(currentChatUser?.id || "") ? "Online" : "Offline" }</span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall
          className="text-panel-header-icon text-xl cursor-pointer"
          title="Call"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon text-xl cursor-pointer"
          title="Video Call"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className="text-panel-header-icon text-xl cursor-pointer"
          title="Search"
          onClick={() => setSearchMessages((prev) => !prev)}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon text-xl cursor-pointer"
          title="Menu"
          onClick={handleContextMenu}
         
        />
        {
          contextmenuVisible && (
            <ContextMenu options={ContextMenuOptions} cordinates={contextmenuCoordinates} setContextMenu={setContextmenuVisible} contextMenu={contextmenuVisible}/>
          )
        }
      </div>
    </div>
  );
};

export default ChatHeader;
