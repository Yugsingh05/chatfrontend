import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
  options: { name: string; callback: () => void }[];
  cordinates: { x: number; y: number };
  contextMenu: boolean;
  setContextMenu: (value: boolean) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ options, cordinates, contextMenu, setContextMenu }) => {
  const contextMenuRef = useRef(null);

  const handleClick = (e, callback) => {
    e.stopPropagation();
    callback();
    setContextMenu(false);
  };

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if(event.target.id !== "context-opener"){
        if(
          contextMenuRef.current &&
          !contextMenuRef.current.contains(event.target)
        ){
          setContextMenu(false);
        }
      }
      
    }

    document.addEventListener("click", handleOutSideClick);
    return () => {
      document.removeEventListener("click", handleOutSideClick);
    }
  },[])

  return (
    <div
      className={`bg-dropdown-background fixed py-2 
         z-[100] shadow-xl`}
      ref={contextMenuRef}
      style={{
        top: cordinates.y,
        left: cordinates.x,
      }}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li key={name} onClick={(e) => handleClick(e, callback)}
          className="px-5 py-2 cursor-pointer hover:bg-background-default-hover">
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
