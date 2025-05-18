import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile, BsMic } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { useChatReducer } from "@/context/ChatContext";
import {  useStateProvider } from "@/context/StateContext";
import { useSocketReducer } from "@/context/SocketContext";
import EmojiPicker from "emoji-picker-react";
import PhotoPicker from "../PhotoPicker";
import dynamic from "next/dynamic";

const CaptureAudio = dynamic(() => import("./CaptureAudio"), { ssr: false });

const MessageBar = () => {
  const [message, SetMessage] = useState("");
  const { currentChatUser, setChatMessages } = useChatReducer();
  const { data } = useStateProvider();
  const [shwoEmojiPicker, setShowEmojiPicker] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [image, setImage] = useState("");
  const { ContextSocket } = useSocketReducer();
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const emojiRef = useRef(null);
  const fileInputRef = useRef(null); // ✅ Ref for the file input

  useEffect(() => {
    const handleClickOutside = (event: { target: { id: string } }) => {
      if (event.target.id !== "emoji-opener") {
        if (emojiRef.current && !emojiRef.current.contains(event.target)) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleEmojiModal = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emoji: { emoji: string }) => {
    SetMessage((prev) => prev + emoji.emoji);
  };

  const handleSend = async () => {
    if (!message) return;

    try {
      const recieverId = currentChatUser?.id || null;
      const senderId = data?.id || null;

      const res = await axios.post(ADD_MESSAGE_ROUTE, {
        message,
        senderId,
        recieverId,
      });

      if (res.data.status) {
        setChatMessages((prev: any) => [...prev, res.data.msg]);

        ContextSocket.emit("send-msg", {
          to: currentChatUser.id,
          from: data.id,
          message: res.data.msg,
        });

        SetMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhotoChange = async (e: { target: { files: unknown[] } }) => {
    try {
      const file = e.target.files[0];

      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("recieverId", currentChatUser?.id || "");
      formdata.append("senderId", data?.id || "");

      const res = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status) {
        setChatMessages((prev: any) => [...prev, res.data.msg]);
        ContextSocket.emit("send-msg", {
          to: currentChatUser.id,
          from: data.id,
          message: res.data.msg,
        });
      }

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecorderChange = () => {
    setShowAudioRecorder(true);
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {!showAudioRecorder &&(<>
      <div className="flex gap-6">
        <BsEmojiSmile
          className="text-panel-header-icon text-xl cursor-pointer"
          title="Emoji"
          onClick={handleEmojiModal}
          id="emoji-opener"
        />
        {shwoEmojiPicker && (
          <div ref={emojiRef} className="absolute bottom-24 left-16 z-40">
            <EmojiPicker theme="dark" onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* ✅ Hidden file input */}
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handlePhotoChange}
          accept="image/*"
        />

        {/* ✅ Clicking this icon triggers input click */}
        <ImAttachment
          className="text-panel-header-icon text-xl cursor-pointer"
          title="Attach"
          onClick={() => fileInputRef.current?.click()}
        />
      </div>

      <div className="w-full rounded-lg h-10 flex items-center">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => SetMessage(e.target.value)}
          className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 w-full"
        />
      </div>

      <div className="flex w-10 items-center justify-center">
        <button>
          {message.length ? (
            <MdSend
              className="text-panel-header-icon text-xl cursor-pointer"
              title="Send"
              onClick={handleSend}
            />
          ) : (
            <BsMic
              className="text-panel-header-icon text-xl cursor-pointer"
              title="Record"
              onClick={handleRecorderChange}
            />
          )}
        </button>
      </div>
      </>
  )}

      {grabPhoto && <PhotoPicker onChange={handlePhotoChange} />}
      {showAudioRecorder && (
        <CaptureAudio hide={() => setShowAudioRecorder(false)} />
      )}
    </div>
  );
};

export default MessageBar;
