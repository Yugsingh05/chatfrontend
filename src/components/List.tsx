import { useChatReducer } from "@/context/ChatContext";
import { user, useStateProvider } from "@/context/StateContext";
import { GET_INITIAL_CONTACT_WITH_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import MessageStatus from "./Chat/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

type ContactUserType = {
  about: string;
  createdAt: string;
  email: string;
  id: string;
  message: string;
  messageId: string;
  messageStatus: string;
  name: string;
  profileImage: string;
  receiverId: string;
  senderId: string;
  totalUnreadMessages: number;
  type: string;
};

export const List = () => {
  const { data } = useStateProvider();
  const {
    setUserContacts,
    setOnlineUsers,
    userContacts,
    setCurrentChatUser,
    onlineUsers,
  } = useChatReducer();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getContacts = async () => {
      if (!data) return;
      try {
        setLoading(true);
        const res = await axios.get(
          GET_INITIAL_CONTACT_WITH_MESSAGES_ROUTE.replace(
            ":userId",
            data?.id || ""
          )
        );
        console.log(res.data);
        if (res.data.success) {
          setUserContacts(res.data.users);
          setOnlineUsers(res.data.onlineUsers);
          console.log(res.data);
        } else {
          console.log(res.data.msg);
          console.log(res.data.error);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getContacts();
  }, [data]);

  const handleClick = ({ user }: { user: ContactUserType }) => {
    console.log(user);
    setCurrentChatUser(user);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[100vh] bg-conversation-panel-background">
        <LoaderCircle
          className="mx-auto my-auto text-icon-green  animate-spin"
          size={50}
        />
      </div>
    );

  return (
    <div
      className="bg-search-input-container-background flex-auto 
     overflow-auto max-h-full custom-scrollbar"
    >
      {(userContacts as ContactUserType[])?.map((contact: ContactUserType) => (
        <div
          key={contact.id}
          className="px-10 py-2 flex items-center gap-5 hover:bg-panel-header-background cursor-pointer"
          onClick={() => handleClick({ user: contact })}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-panel-header-icon">
              <Image
                src={contact.profileImage}
                width={40}
                height={40}
                alt="profileImage"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-primary-strong">{contact.name}</span>
              {onlineUsers.includes(contact.id) && (
                <span className="text-lime-200 font-semibold">ONLINE</span>
              )}
              <span
                className={`${
                  contact.totalUnreadMessages <= 0
                    ? "text-secondary"
                    : "text-icon-green"
                } text-sm`}
              >
                {calculateTime(contact.createdAt)}
              </span>

              {contact.senderId === data?.id && (
                <MessageStatus status={contact.messageStatus} />
              )}
              {contact.type === "text" && (
                <span className="truncate text-secondary">{contact.message}</span>
              )}
              {contact.type === "audio" && (
                <span className="flex gap-1 items-center text-secondary"><FaMicrophone className="text-icon-green" /> Audio</span>
              )}
              {contact.type === "image" && (
                <span className="flex gap-1 items-center text-secondary"><FaCamera className="text-icon-green" /> Image</span>
              )}
              {contact.totalUnreadMessages > 0 && <span className="bg-green-400 px-[5px] w-5 rounded-full text-sm ">{contact.totalUnreadMessages}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
