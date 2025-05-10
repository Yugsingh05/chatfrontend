import Image from "next/image";
import React, { useEffect, useState } from "react";

import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

type AvatarPTops = {
  type: string;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
};
const Avatar = ({ type, image, setImage }: AvatarPTops) => {
  const [hover, setHover] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCapture,setShowCapture] = useState(false);



  useEffect(() => {
    if(grabPhoto){
      const data = document.getElementById("photo-picker");
      data?.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        },1000)
      }
    }
  },[grabPhoto]);


  const showContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX, y: e.pageY });
    setIsContextMenuVisible(true);
  };

  const contextMenuOptions = [
    { name: "take Photo", callback: () => {
      setShowCapture(true);
     } },
    { name: "Choose from library", callback: () => { 
      setShowLibrary(true);
    } },
    { name: "Upload Photo", callback: () => { 
      setGrabPhoto(true);
    } },
    {
      name: "Remove Photo",
      callback: () => {
        setImage("/default_avatar.png");
      },
    },
  ];

  


  const photoPickerChange = async(e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function (event) {
      data.src = event.target?.result;
      data.setAttribute("data-src",event.target?.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src);
    },100)

  }

  if(!image) return null
  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="Avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="Avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer  z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`z-10 bg-photopicker-overlay-background absolute h-60 w-60 flex items-center 
                 justify-center 
                         top-0 left-0 rounded-full flex-col text-center gap-2 ${hover ? "visible" : "hidden"
                }`}
              onClick={(e) => showContextMenu(e)}
              id="context-opener"
            >
              <FaCamera
                className="text-2xl"
                id="context-opener"
                onClick={(e) => showContextMenu(e)}
              />
              <p
                className="text-white"
                onClick={(e) => showContextMenu(e)}
                id="context-opener"
              >
                Change Photo
              </p>
            </div>
            <div className="h-60 w-60 flex items-center justify-center">
              <Image src={image} alt="Avatar" className="rounded-full" fill />
            </div>
          </div>
        )}
      </div>

      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {showCapture && <CapturePhoto setImage={setImage} setShowCapture={setShowCapture} />}
      {showLibrary &&  <PhotoLibrary setImage={setImage} setShowLibrary={setShowLibrary}   />}
      {grabPhoto &&<PhotoPicker
      onChange={photoPickerChange}/>}
    </>
  );
};

export default Avatar;
