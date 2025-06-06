import { useChatReducer } from "@/context/ChatContext";
import { useStateProvider } from "@/context/StateContext";
import { GET_INITIAL_CONTACT_WITH_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import MessageStatus from "./Chat/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";
import { useSocketReducer } from "@/context/SocketContext";
import { MessageType } from "./Chat/ChatContainer";

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

interface ListProps {
  onChatSelect?: () => void;
}

export const List: React.FC<ListProps> = ({ onChatSelect }) => {
  const { data } = useStateProvider();
  const {
    setUserContacts,
    setOnlineUsers,
    userContacts,
    setCurrentChatUser,
    onlineUsers,
    searchedUsers,
    currentChatUser,
  } = useChatReducer();

  const { ContextSocket } = useSocketReducer();
  const [loading, setLoading] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState<ContactUserType[]>([]);

  useEffect(() => {
    const getContacts = async () => {
      if (!data?.id) return;

      try {
        setLoading(true);
        const res = await axios.get(
          GET_INITIAL_CONTACT_WITH_MESSAGES_ROUTE.replace(":userId", data.id)
        );

        if (res.data.success) {
          setUserContacts(res.data.users);
          setOnlineUsers(res.data.onlineUsers);
        } else {
          console.warn(res.data.msg || res.data.error);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    getContacts();
  }, [data?.id, setUserContacts, setOnlineUsers]);

  useEffect(() => {
    if (searchedUsers?.trim() && userContacts?.length) {
      const filtered = userContacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchedUsers.toLowerCase())
      );
      setSearchedContacts(filtered);
    } else {
      setSearchedContacts([]);
    }
  }, [searchedUsers, userContacts]);

  const handleClick = (user: ContactUserType) => {
    const { id, about, name, profileImage, email } = user;

    setCurrentChatUser({
      id,
      about,
      name,
      profileImage,
      email,
      status: true,
      isNewUser: false,
    });

    setUserContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === user.id
          ? { ...contact, totalUnreadMessages: 0 }
          : contact
      )
    );

    // Switch to chat view on mobile (if handler is provided)
    onChatSelect?.();
  };

  const contactList = searchedUsers ? (searchedContacts as ContactUserType[]) : userContacts;

  useEffect(() => {
    if (!ContextSocket) return;

    const handleMessageReceive = (data: { message: MessageType; type: string; totalUnreadMessages: number }) => {
      setUserContacts((prevContacts) =>
        prevContacts.map((contact) => {
          const isCurrentChatUser = currentChatUser?.id === contact.id;
          const isSender = contact.id === data.message.senderId;

          if (!isSender) return contact;

          return {
            ...contact,
            message: data.message.message,
            totalUnreadMessages: isCurrentChatUser ? 0 : (contact.totalUnreadMessages || 0) + 1,
            type: data.message.type,
          };
        })
      );
    };

    ContextSocket?.on("msg-receive", handleMessageReceive);

    return () => {
      ContextSocket?.off("msg-receive", handleMessageReceive);
    };
  }, [ContextSocket, currentChatUser?.id, setUserContacts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh] bg-conversation-panel-background">
        <LoaderCircle className="text-icon-green animate-spin" size={50} />
      </div>
    );
  }

  if (!contactList?.length) {
    return (
      <div className="flex items-center justify-center h-[100vh] bg-conversation-panel-background">
        <span className="text-white text-primary-strong">No contact found</span>
      </div>
    );
  }

  if (searchedUsers && searchedContacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[100vh] bg-conversation-panel-background">
        <span className="text-white text-primary-strong">No contact found</span>
      </div>
    );
  }

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {contactList?.map((contact) => (
        <div
          key={contact.id}
          className="px-10 py-2 flex items-center gap-5 hover:bg-gray-800 cursor-pointer"
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-panel-header-icon">
              <Image
                src={contact.profileImage}
                width={40}
                height={40}
                alt="Profile"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-primary-strong">{contact.name}</span>

              {onlineUsers.includes(contact.id) && (
                <span className="text-lime-200 font-semibold">ONLINE</span>
              )}

              <span
                className={`${
                  contact.totalUnreadMessages > 0
                    ? "text-icon-green"
                    : "text-secondary"
                } text-sm`}
              >
                {calculateTime(contact.createdAt)}
              </span>

              {contact.senderId === data?.id && (
                <MessageStatus status={contact.messageStatus} />
              )}

              {contact.type === "text" && (
                <span className="truncate text-secondary">
                  {contact.message}
                </span>
              )}
              {contact.type === "audio" && (
                <span className="flex gap-1 items-center text-secondary">
                  <FaMicrophone className="text-icon-green" /> Audio
                </span>
              )}
              {contact.type === "image" && (
                <span className="flex gap-1 items-center text-secondary">
                  <FaCamera className="text-icon-green" /> Image
                </span>
              )}

              {contact.totalUnreadMessages > 0 && (
                <span className="bg-green-400 px-[5px] w-5 rounded-full text-sm text-center">
                  {contact.totalUnreadMessages}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
