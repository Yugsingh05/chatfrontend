import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
  options: { name: string; callback: () => void }[];
  cordinates: { x: number; y: number };
  contextMenu: boolean;
  setContextMenu: (value: boolean) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  options,
  cordinates,
  setContextMenu,
}) => {
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    callback: () => void
  ) => {
    e.stopPropagation();
    callback();
    setContextMenu(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenu(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [setContextMenu]);

  

  return (
    <div
      ref={contextMenuRef}
      className="fixed z-50 bg-neutral-800 rounded-md shadow-lg w-auto"
      style={{
        top: cordinates.y,
        left: cordinates.x,
      }}
    >
      <ul className="py-2">
        {options.map(({ name, callback }) => (
          <li
            key={name}
            onClick={(e) => handleClick(e, callback)}
            className="px-5 py-1 text-md font-mono text-white hover:bg-neutral-700 cursor-pointer transition-colors w-full"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
