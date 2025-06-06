import { useChatReducer } from "@/context/ChatContext";
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { MessageType } from "./ChatContainer";
import { calculateTime } from "@/utils/CalculateTime";

interface MessageSearchProps {
  onClose?: () => void;  // Optional callback for mobile back button
  onSearchClick?: () => void;
}

const MessageSearch: React.FC<MessageSearchProps> = ({ onClose }) => {
  const { setSearchMessages, currentChatUser, ChatMessages } = useChatReducer();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (searchTerm === "") {
      setSearchedMessages([]);
    } else {
      setSearchedMessages(
        ChatMessages.filter((message: MessageType) => {
          if (message.type === "image" || message.type === "audio") return false;
          return message.message.toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
  }, [searchTerm, ChatMessages]);

  // Handler to close search, both desktop and mobile
  const handleClose = () => {
    setSearchMessages(false);
    if (onClose) onClose();
  };

  return (
    <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col min-h-screen border-b-4 border-b-icon-green max-h-screen z-10">
      <div className="h-16 px-4 py-5 flex gap-4 items-center bg-panel-header-background text-primary-strong relative">
        {/* Mobile Back Button */}
        <button
          onClick={handleClose}  
          className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded shadow  text-black text-4xl px-2 pb-2 h-7.5 w-10 flex items-center justify-center"
          aria-label="Back"
        >
          ←
        </button>

        {/* Close Icon for Desktop */}
        <IoClose
          className="cursor-pointer text-icon-lighter text-2xl hidden md:block"
          onClick={handleClose}
          title="Close Search"
        />
        <span className="mx-auto md:mx-0">Search Messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex items-center flex-col w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full ">
            <div className="bg-input-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow w-full">
              <BiSearchAlt2
                className="text-panel-header-icon text-xl cursor-pointer"
                title="Search"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
                autoFocus
              />
            </div>
          </div>
          <span className="mt-10 text-secondary">
            {searchTerm.length > 0 &&
              `Search for messages with ${currentChatUser?.name}`}
          </span>
        </div>
        <div className="flex justify-center h-full flex-col">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No messages found
            </span>
          )}

          <div className="flex flex-col w-full h-full">
            {searchedMessages.map((message: MessageType) => (
              <div
                key={message.id}
                className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[0.1px] border-secondary py-5"
              >
                <div className="text-sm text-secondary">
                  {calculateTime(message.createdAt)}
                </div>
                <div className="text-icon-green">{message.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSearch;
