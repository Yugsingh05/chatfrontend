import React, { useState } from "react";
import { ChatListHeader } from "./ChatListHeader";
import { SearchBar } from "./SearchBar";
import { List } from "./List";
import ContactList from "./Chat/ContactList";

interface ChatListProps {
  onChatSelect?: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const [isAllContacts, setIsAllContacts] = useState(true);

  return (
    <div className="bg-panel-header-background flex flex-col h-full max-h-screen z-20 w-full sm:w-full">
      {isAllContacts ? (
        <>
          <ChatListHeader setContacts={setIsAllContacts} />
          <SearchBar />
          <List onChatSelect={onChatSelect} />
        </>
      ) : (
        <ContactList setIsAllContacts={setIsAllContacts} />
      )}
    </div>
  );
};

export default ChatList;
