import React from "react";
import Avatar from "./Avatar";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import ContextMenu from "./ContextMenu";
import { useSocketReducer } from "@/context/SocketContext";

export const ChatListHeader = ({ setContacts }) => {
  const { data, handleLogout } = useStateProvider();
  const [contextMenuVisible, setContextMenuVisible] = React.useState(false);
  const {ContextSocket} = useSocketReducer();
    const [contextMenuCoordinates, setContextMenuCoordinates] = React.useState({
    x: 0,
    y: 0,
  });

  const ContextMenuOptions = [
    {
      name: "Logout",
      callback: () => {
        handleLogout();
        ContextSocket.emit("logout", { userId: data.id });
        setContextMenuVisible(false);
      },
    },
  ];

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuCoordinates({ x: event.clientX - 70, y: event.clientY + 20 });
    setContextMenuVisible(true);
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={data?.profileImage} setImage={() => {}} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon text-xl cursor-pointer"
          title="New Chat"
          onClick={() => setContacts((prev) => !prev)}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon text-xl cursor-pointer"
            title="Menu"
            onClick={handleContextMenu}
          />
          {contextMenuVisible && (
            <ContextMenu
              options={ContextMenuOptions}
              cordinates={contextMenuCoordinates}
              setContextMenu={setContextMenuVisible}
              contextMenu={contextMenuVisible}
            />
          )}
        </>
      </div>
    </div>
  );
};
