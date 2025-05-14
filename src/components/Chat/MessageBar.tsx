import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import axios from "axios";
import { ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { useChatReducer } from "@/context/ChatContext";
import { useStateProvider } from "@/context/StateContext";
import { useSocketReducer } from "@/context/SocketContext";

const MessageBar = () => {
  const [message, SetMessage] = useState("");
  const { currentChatUser } = useChatReducer();
  const { data } = useStateProvider();

  const {ContextSocket} = useSocketReducer();

  const handleSend = async () => {
    if (!message) return;

    try {
      const recieverId = currentChatUser?.id || null;
      const senderId = data?.id || null;

      const res = await axios.post(ADD_MESSAGE_ROUTE, {
        message,
        senderId,
        recieverId,
      });

      console.log(res.data);

      if (res.data.status) { 
        
        ContextSocket.emit("send-msg",{
          to : currentChatUser.id,
          from : data.id,
          message : res.data.msg
        })
        SetMessage("");
       
      }


    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon text-xl cursor-pointer"
            title="Emoji"
          />
          <ImAttachment
            className="text-panel-header-icon text-xl cursor-pointer"
            title="Attachment"
          />
        </div>
        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => SetMessage(e.target.value)}
            className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 w-full"
          />
        </div>

        <div className="flex w-10 items-center justify-center">
          <button>
            <MdSend
              className="text-panel-header-icon text-xl cursor-pointer"
              title="Send"
              onClick={handleSend}
            />
            {/* <FaMicrophone className="text-panel-header-icon text-xl cursor-pointer" title="Record" /> */}
          </button>
        </div>
      </>
    </div>
  );
};

export default MessageBar;
