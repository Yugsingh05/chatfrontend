import React, { useState } from "react";
import { ChatListHeader } from "./ChatListHeader";
import { SearchBar } from "./SearchBar";
import { List } from "./List";
import ContactList from "./Chat/ContactList";

const ChatList = ({contact}) => {
  const [isAllContacts, setIsAllContacts] = useState(true);
  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
      {isAllContacts ? (
        <>
          <ChatListHeader setContacts={setIsAllContacts} />
          <SearchBar />
          <List />
        </>
      ) : (
        <ContactList setIsAllContacts={setIsAllContacts} />
      )}
    </div>
  );
};

export default ChatList;
