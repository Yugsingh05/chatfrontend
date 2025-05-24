import { useChatReducer } from "@/context/ChatContext";
import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";

export const SearchBar = () => {

  const {searchedUsers,setSearchedUsers} = useChatReducer()
  return (
    <div className="bg-search-input-container-background flex py- pl-5 items-center gap-3 h-14">
      <div className=" bg-input-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2
            className="text-panel-header-icon text-xl cursor-pointer"
            title="Search"
          />
        </div>
        <div>
          <input
            type="text"
            value={searchedUsers}
            onChange={(e) => setSearchedUsers(e.target.value)}
            placeholder="Search or start a new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
          />
        </div>
      </div>
      <div className="pr-5 pl-3">
        <BsFilter className="text-panel-header-icon text-lg cursor-pointer"/>

      </div>
    </div>
  );
};
