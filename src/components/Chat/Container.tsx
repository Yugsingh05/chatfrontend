import { useChatReducer } from "@/context/ChatContext";
import { useSocketReducer } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";
import { GET_CALL_TOKEN_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

interface CallData {
  id: string;
  name: string;
  profileImage: string;
  callType: "audio" | "video";
  type: "in-coming" | "out-going";
  roomId: number;
}

const Container = ({ CallData }: { CallData: CallData }) => {
  const { ContextSocket } = useSocketReducer();
  const { EndCall } = useChatReducer();
  const { data } = useStateProvider();

  const [token, setToken] = useState<string>("");
  const [zego, setZego] = useState<ZegoExpressEngine | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  // End call handler
  const endCall = () => {
    if (CallData.callType === "voice") {
      ContextSocket.emit("reject-voice-call", { from: CallData.id });
    } else {
      ContextSocket.emit("reject-video-call", { from: CallData.id });
    }

    if (zego && localStream) {
      zego.stopPublishingStream(`stream-${data.id}`);
      zego.destroyStream(localStream);
      zego.logoutRoom(CallData.roomId.toString());
    }

    EndCall();
  };

  // Handle call acceptance logic
  useEffect(() => {
    if (CallData.type === "out-going") {
      ContextSocket.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => setCallAccepted(true), 1000);
    }

    return () => {
      ContextSocket.off("accept-call");
    };
  }, [CallData.type]);

  // Fetch token from backend
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.get(
          GET_CALL_TOKEN_ROUTE.replace(":userId", data.id)
        );
        if (res.data.status) {
          setToken(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    if (!token && callAccepted) getToken();
  }, [callAccepted]);

  // Initialize Zego SDK and start call
  useEffect(() => {
    if (!token || !callAccepted) return;

    let zg: ZegoExpressEngine;

    import("zego-express-engine-webrtc").then(({ ZegoExpressEngine }) => {
      zg = new ZegoExpressEngine(
        parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!),
        process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!
      );

      setZego(zg);

      // Room stream update listener
      zg.on("roomStreamUpdate", async (roomId, updateType, streamList) => {
        if (updateType === "ADD") {
          for (const streamInfo of streamList) {
            try {
              const remoteStream = await zg.startPlayingStream(
                streamInfo.streamID,
                {
                  audio: true,
                  video: CallData.callType === "video",
                }
              );

              const videoEl = document.createElement("video");
              videoEl.id = streamInfo.streamID;
              videoEl.autoplay = true;
              videoEl.playsInline = true;
              videoEl.muted = false;
              videoEl.className = "w-full h-full object-cover";
              videoEl.srcObject = remoteStream;

              remoteVideoRef.current?.appendChild(videoEl);
            } catch (err) {
              console.error("Error playing remote stream:", err);
            }
          }
        }

        if (updateType === "DELETE") {
          for (const streamInfo of streamList) {
            const el = document.getElementById(streamInfo.streamID);
            if (el) el.remove();
          }
        }
      });

      // Login to room
      zg.loginRoom(CallData.roomId.toString(), token, {
        userID: data.id.toString(),
        userName: data.name,
      });

      // Create local stream
      zg.createStream({
        camera: {
          audio: true,
          video: CallData.callType === "video",
        },
      }).then((stream) => {
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const streamId = `stream-${data.id}`;
        zg.startPublishingStream(streamId, stream);
        console.log("Published stream ID:", streamId);
      });

      return () => {
        if (zego && localStream) {
          zego.stopPublishingStream(`stream-${data.id}`);
          zego.destroyStream(localStream);
          zego.logoutRoom(CallData.roomId.toString());
        }
      };
    });
  }, [token]);

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-white">
      {/* Remote Video */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          CallData.callType === "video" ? "bg-black" : "bg-gray-900"
        }`}
      >
        <div
          ref={remoteVideoRef}
          className="w-full h-full flex items-center justify-center"
        >
          {!callAccepted && <p className="text-white text-xl">Connecting...</p>}
        </div>
      </div>

      {/* Local Video Preview (Bottom Right) */}
      {CallData.callType === "video" && callAccepted && (
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="h-24 w-32 rounded-lg absolute bottom-5 right-5 border-2 border-blue-500 shadow-lg z-10"
        />
      )}

      {/* Name and Status Text */}
      <div className="absolute top-5 left-5 text-white z-10">
        <h2 className="text-2xl font-semibold">{CallData.name}</h2>
        <p className="text-sm opacity-80">
          {callAccepted
            ? CallData.callType === "video"
              ? "In Video Call"
              : "In Audio Call"
            : "Calling..."}
        </p>
      </div>

{ callAccepted && CallData.callType === "audio" && (
        <Image src={CallData.profileImage} alt="profileImage" width={150} height={150} className=" absolute  text-white my-auto mx-auto rounded-full"/>
)

}

   

      {/* End Call Button */}
      <button
        onClick={endCall}
        className="absolute bottom-15 left-1/2 transform -translate-x-1/2 h-16 w-16 bg-red-600 rounded-full flex items-center justify-center z-10 cursor-pointer"
        aria-label="End call"
      >
        <MdOutlineCallEnd className="text-3xl text-white" />
      </button>
    </div>
  );
};

export default Container;
