import { useChatReducer } from "@/context/ChatContext";
import { user } from "@/context/StateContext";
import { GET_ALL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";

interface ContactListProps {
  setIsAllContacts: (value: boolean) => void;
}

const ContactList: React.FC<ContactListProps> = ({ setIsAllContacts }) => {
  const [allContacts, setAllContacts] = useState<Record<string, user[]>>({});
  const { setCurrentChatUser, searchedUsers, setSearchedUsers } = useChatReducer();

  // Fetch contacts once
  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await axios.get(GET_ALL_CONTACTS_ROUTE);
        setAllContacts(res.data.data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };
    getContacts();
  }, []);

  // Memoized flat list of all users for search
  const allUsersFlat = useMemo(() => {
    return Object.values(allContacts).flat();
  }, [allContacts]);

  // Filter contacts based on the search string
  const filteredContacts = useMemo(() => {
    if (!searchedUsers.trim()) return [];
    const lowerSearch = searchedUsers.toLowerCase();
    return allUsersFlat.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerSearch) ||
        contact.email.toLowerCase().includes(lowerSearch)
    );
  }, [searchedUsers, allUsersFlat]);

  const handleClick = (user: user) => {
    setCurrentChatUser(user);
  };

  const renderContactItem = (contact: user, key: string) => (
    <div
      key={key}
      className="px-10 py-2 flex items-center gap-5 hover:bg-gray-700 cursor-pointer"
      onClick={() => handleClick(contact)}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-panel-header-icon overflow-hidden">
          <Image
            src={contact.profileImage}
            width={40}
            height={40}
            alt="profileImage"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-primary-strong">{contact.name}</span>
          <span className="text-secondary text-sm">{contact.email}</span>
        </div>
      </div>
    </div>
  );

  const hasContacts = Object.keys(allContacts).length > 0;
  const hasSearch = searchedUsers.trim().length > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-24 flex items-end px-3 py-12">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => setIsAllContacts(true)}
          />
          <span>{hasContacts ? "New Chat" : "No Contacts"}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-search-input-container-background flex -my-8 pl-5 items-center gap-3 h-14">
        <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
          <BiSearchAlt2 className="text-panel-header-icon text-xl cursor-pointer" />
          <input
            type="text"
            value={searchedUsers}
            onChange={(e) => setSearchedUsers(e.target.value)}
            placeholder="Search or start a new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
          />
        </div>
        <div className="pr-5 pl-3">
          <BsFilter className="text-panel-header-icon text-lg cursor-pointer" />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex flex-col overflow-y-scroll h-full mt-5 custom-scrollbar">
        {hasSearch && filteredContacts.length === 0 && (
          <div className="text-teal-light pl-10 py-5 uppercase">No Results</div>
        )}

        {hasSearch && filteredContacts.length > 0 && (
          <>
            <div className="text-teal-light pl-10 py-5 uppercase">Results</div>
            {filteredContacts.map((contact) =>
              renderContactItem(contact, contact.id.toString())
            )}
          </>
        )}

        {!hasSearch &&
          Object.entries(allContacts).map(([initial, group]) => (
            <div key={initial}>
              <div className="text-teal-light pl-10 py-5 uppercase">{initial}</div>
              {group.map((contact) =>
                renderContactItem(contact, `${initial}-${contact.id}`)
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ContactList;
