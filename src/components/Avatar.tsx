import Image from "next/image";
import React, { useEffect, useState } from "react";

import { FaCamera, FaTimes } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

type AvatarPTops = {
  type: "sm" | "lg" | "xl";
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
};

const Avatar = ({ type, image, setImage }: AvatarPTops) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({ x: 0, y: 0 });
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCapture, setShowCapture] = useState(false);

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data?.click();
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  // For mobile and desktop, use click/tap to toggle overlay
  const toggleOverlay = () => {
    setShowOverlay((prev) => !prev);
  };

  const showContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    // For mobile, open centered context menu (modal style)
    const x = "touches" in e ? window.innerWidth / 2 : (e as React.MouseEvent).pageX;
    const y = "touches" in e ? window.innerHeight / 2 : (e as React.MouseEvent).pageY;

    setContextMenuCoordinates({ x, y });
    setIsContextMenuVisible(true);
    setShowOverlay(false);
  };

  const contextMenuOptions = [
    {
      name: "Take Photo",
      callback: () => {
        setShowCapture(true);
        setIsContextMenuVisible(false);
      },
    },
    {
      name: "Choose from Library",
      callback: () => {
        setShowLibrary(true);
        setIsContextMenuVisible(false);
      },
    },
    {
      name: "Upload Photo",
      callback: () => {
        setGrabPhoto(true);
        setIsContextMenuVisible(false);
      },
    },
    {
      name: "Remove Photo",
      callback: () => {
        setImage("/default_avatar.png");
        setIsContextMenuVisible(false);
      },
    },
  ];

  const photoPickerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      if (typeof event.target?.result === "string") {
        setImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!image) return null;

  // Responsive size classes for image container
  const sizeClasses = {
    sm: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-48 w-48 md:h-60 md:w-60",
  };

  return (
    <>
      <div className="flex items-center justify-center relative">
        {/* Avatar image */}
        <div
          className={`relative cursor-pointer rounded-full overflow-hidden ${sizeClasses[type]}`}
          onClick={type === "xl" ? toggleOverlay : undefined}
          aria-label="User Avatar"
          role="img"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" && type === "xl") toggleOverlay();
          }}
        >
          <Image src={image} alt="Avatar" fill className="object-cover" />

          {/* Overlay for 'xl' size only */}
          {type === "xl" && showOverlay && (
            <div
              className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center rounded-full text-white p-4 z-20 select-none"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Change avatar options"
            >
              <button
                onClick={showContextMenu}
                className="flex flex-col items-center gap-2 focus:outline-none"
                aria-haspopup="true"
              >
                <FaCamera className="text-3xl" />
                <span>Change Photo</span>
              </button>
              <button
                onClick={() => setShowOverlay(false)}
                className="absolute top-2 right-2 text-white text-xl focus:outline-none"
                aria-label="Close overlay"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu Modal - centered on mobile or where clicked */}
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCoordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
         
        />
      )}

      {showCapture && (
        <CapturePhoto setImage={setImage} setShowCapture={setShowCapture} />
      )}
      {showLibrary && (
        <PhotoLibrary setImage={setImage} setShowLibrary={setShowLibrary} />
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  );
};

export default Avatar;
