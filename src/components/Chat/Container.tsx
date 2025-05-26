"use client";

import { useChatReducer } from "@/context/ChatContext";
import { useSocketReducer } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";
import { GET_CALL_TOKEN_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";

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
  const [zego, setZego] = useState<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  const endCall = () => {
    // Emit rejection event
    if (CallData.callType === "audio") {
      ContextSocket.emit("reject-voice-call", { from: CallData.id });
    } else {
      ContextSocket.emit("reject-video-call", { from: CallData.id });
    }

    // Clean up ZEGO resources
    if (zego && localStream) {
      try {
        zego.stopPublishingStream(`stream-${data.id}`);
        zego.destroyStream(localStream);
        zego.logoutRoom(CallData.roomId.toString());
      } catch (err) {
        console.error("ZEGO cleanup error:", err);
      }
    }

    EndCall();
  };

  // Handle call acceptance
  useEffect(() => {
    if (CallData.type === "out-going") {
      const handleAccept = () => setCallAccepted(true);
      ContextSocket.on("accept-call", handleAccept);
      return () => ContextSocket.off("accept-call", handleAccept);
    } else {
      setCallAccepted(true);
    }
  }, [CallData.type]);

  // Fetch ZEGO token
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

  // Initialize ZEGO SDK and manage streams
  useEffect(() => {
    if (!token || !callAccepted) return;

    let zg: any;
    let localStream: MediaStream | null = null;

    const initZego = async () => {
      try {
        const { ZegoExpressEngine } = await import(
          "zego-express-engine-webrtc"
        );

        const appId = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;

        if (!appId || !serverSecret) {
          throw new Error("ZEGO credentials are not set properly.");
        }

        zg = new ZegoExpressEngine(appId, true); // Test environment
        zg.setLogConfig({
          logLevel: "debug",
          remoteLogLevel: "info",
        });

        setZego(zg);

        // Validate device permissions
        try {
          const constraints = {
            audio: true,
            video: CallData.callType === "video",
          };
          const stream = await navigator.mediaDevices.getUserMedia(
            constraints
          );
          stream.getTracks().forEach((track) => track.stop()); // Release immediately
        } catch (permErr) {
          console.error("Permission error for camera/mic:", permErr);
          alert(
            "Microphone or camera access is required. Please check your browser permissions."
          );
          return;
        }

        // Stream update handler for remote streams
        const roomStreamUpdate = async (
          roomId: string,
          updateType: string,
          streamList: any[]
        ) => {
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
                videoEl.play().catch((err) =>
                  console.error("Remote video autoplay failed:", err)
                );
              } catch (err) {
                console.error("Failed to play remote stream:", err);
              }
            }
          }

          if (updateType === "DELETE") {
            for (const streamInfo of streamList) {
              const el = document.getElementById(streamInfo.streamID);
              if (el) el.remove();
            }
          }
        };

        zg.on("roomStreamUpdate", roomStreamUpdate);

        // Login to ZEGO room
        await zg.loginRoom(CallData.roomId.toString(), token, {
          userID: data.id.toString(),
          userName: data.name,
        });

        // Create and publish local stream
        try {
          localStream = await zg.createStream({
            camera: {
              audio: true,
              video: CallData.callType === "video",
            },
          });
          setLocalStream(localStream);
        } catch (err) {
          console.error("❌ createStream failed:", err);
          alert("Failed to initialize camera/microphone.");
          return;
        }

        // Attach local stream to video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current
            .play()
            .catch((err) =>
              console.error("Local video autoplay failed:", err)
            );
        }

        // Start publishing stream
        const streamId = `stream-${data.id}`;
        try {
          zg.startPublishingStream(streamId, localStream);
          console.log("✅ Published stream ID:", streamId);
        } catch (publishErr) {
          console.error("❌ Publishing stream failed:", publishErr);
        }

        // Cleanup on unmount
        return () => {
          zg.off("roomStreamUpdate", roomStreamUpdate);
          if (zg && localStream) {
            try {
              zg.stopPublishingStream(streamId);
              zg.destroyStream(localStream);
              zg.logoutRoom(CallData.roomId.toString());
            } catch (err) {
              console.error("ZEGO cleanup error:", err);
            }
          }
        };
      } catch (err) {
        console.error("Zego initialization error:", err);
      }
    };

    const cleanupPromise = initZego();

    return () => {
      cleanupPromise?.then((cleanup) => {
        if (typeof cleanup === "function") {
          cleanup();
        }
      });
    };
  }, [token, callAccepted]);

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

      {/* Local Video (always visible) */}
      {CallData.callType === "video" && (
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className={`h-24 w-32 rounded-lg absolute bottom-5 right-5 border-2 border-blue-500 shadow-lg z-10 ${
            !callAccepted ? "opacity-50" : ""
          }`}
        />
      )}

      {/* Caller Info */}
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

      {/* Profile Image for Audio Call */}
      {callAccepted && CallData.callType === "audio" && (
        <Image
          src={CallData.profileImage}
          alt="Profile"
          width={150}
          height={150}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      )}

      {/* End Call Button */}
      <button
        onClick={endCall}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 h-16 w-16 bg-red-600 rounded-full flex items-center justify-center z-10 cursor-pointer"
        aria-label="End call"
      >
        <MdOutlineCallEnd className="text-3xl text-white" />
      </button>
    </div>
  );
};

export default Container;