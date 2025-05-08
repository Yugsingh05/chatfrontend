import React, { useRef } from "react";

interface ContextMenuProps {
  options: { name: string; callback: () => void }[];
  cordinates: { x: number; y: number };
  contextMenu: boolean;
  setContextMenu: (value: boolean) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ options, cordinates, contextMenu, setContextMenu }) => {
  const contextMenuRef = useRef(null);

  const handleClick = (e, callback) => {};

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
          <li key={name} onClick={(e) => handleClick(e, callback)}>
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
