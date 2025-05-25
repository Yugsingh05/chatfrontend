import { useChatReducer } from "@/context/ChatContext";
import { useSocketReducer } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";
import { GET_CALL_TOKEN_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

const Container = ({ CallData }) => {
  const { ContextSocket } = useSocketReducer();

  const { EndCall } = useChatReducer();
  const { data } = useStateProvider();
  const [token, setToken] = useState("");
  const [zgVar, setZgVar] = useState<ZegoExpressEngine | undefined>(undefined);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(
    undefined
  );
  const [publishStream, setPublishStream] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);

  const endCall = () => {
    if (CallData.callType === "voice") {
      ContextSocket.emit("reject-voice-call", { from: CallData.id });

      if (zgVar && localStream && publishStream) {
        zgVar.destroyStream(localStream);
        zgVar.stopPublishingStream(publishStream);
        zgVar.logoutRoom(CallData.roomId.toString());
      }
    } else {
      ContextSocket.emit("reject-video-call", { from: CallData.id });
    }
    EndCall();
  };

  useEffect(() => {
    if (CallData.type === "out-going") {
      ContextSocket.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [CallData]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.get(
          `${GET_CALL_TOKEN_ROUTE}`.replace(":userId", data.id)
        );

        if (res.data.status) {
          setToken(res.data.data);
        } else {
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getToken();
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          const zego = new ZegoExpressEngine(
            parseInt(`${process.env.NEXT_PUBLIC_ZEGO_APP_ID}`),
            process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || ""
          );

          setZgVar(zego);

          zego.on(
            "roomStreamUpdate",
            async (roomId, updateType, streamList, extendedDate) => {
              if (updateType === "ADD") {
                const rmVideo = document.getElementById("remote-video");
                const vd = document.createElement(
                  CallData.callType === "video" ? "video" : "audio"
                );
                vd.id = streamList[0].streamID;
                vd.autoplay = true;
                vd.muted = false;
                if (rmVideo) {
                  rmVideo.appendChild(vd);
                }
                zego
                  .startPlayingStream(streamList[0].streamID, {
                    audio: true,
                    video: true,
                  })
                  .then((stream) => (vd.srcObject = stream));
              } else if (
                updateType === "DELETE" &&
                zego &&
                localStream &&
                streamList[0].streamID
              ) {
                zego.destroyStream(localStream);
                zego.stopPlayingStream(streamList[0].streamID);
                zego.logoutRoom(CallData.roomId.toString());
                EndCall();
              }
            }
          );

          await zego.loginRoom(
            CallData.roomId.toString(),
            token,
            {
              userID: data.id.toString(),
              userName: data.name,
            },
            {
              userUpdate: true,
            }
          );

          const localStream = await zego.createStream({
            camera: {
              audio: true,
              video: CallData.callType === "video" ? true : false,
            },
          });
          const localVideo = document.getElementById("local-audio");
          const videoElement = document.createElement(
            CallData.callType === "video" ? "video" : "audio"
          );
          videoElement.id = "video-local-zego";
          videoElement.className = "h-28 w-32";
          videoElement.autoplay = true;
          videoElement.muted = false;

          localVideo?.appendChild(videoElement);

          const td = document.getElementById("video-local-zego") as HTMLVideoElement;
          td.srcObject = localStream;
          const StreamId = "123" + Date.now().toString();
          setPublishStream(StreamId);
          setLocalStream(localStream);
          zego.startPublishingStream(StreamId, localStream);
        }
      );
    };

    if (token) startCall();
  }, [token]);

  return (
    <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex items-center justify-center flex-col h-full text-white overflow-auto ">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl ">{CallData.name}</span>
        <span className="text-lg">
          {callAccepted && CallData.callType !== "video"
            ? "On going call"
            : "Calling"}
        </span>
      </div>
      {(callAccepted || CallData.callType === "audio") && (
        <div className="my-24 mx-auto">
          <Image
            src={CallData.profileImage}
            alt="profileImage"
            width={250}
            height={250}
            className="rounded-full"
          />
        </div>
      )}

      <div className="my-5 relative" id="remote-video">
         <p className="text-white my-5">hi</p>
        <div className="absolute bottom-5 right-5" id="local-audio">
          
        </div>
      </div>
     

      <button
        className="h-16 w-16 bg-red-600 mx-auto flex items-center justify-center rounded-full cursor-pointer"
        onClick={() => endCall()}
      >
        <MdOutlineCallEnd className="text-3xl cursor-pointer " />
      </button>
    </div>
  );
};

export default Container;
