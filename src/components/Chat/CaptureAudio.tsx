import { useChatReducer } from "@/context/ChatContext";
import { useSocketReducer } from "@/context/SocketContext";
import { useStateProvider } from "@/context/StateContext";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPause, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import { MessageType } from "./ChatContainer";

const CaptureAudio = ({ hide } : { hide: () => void }) => {
  const { data } = useStateProvider();
  const { currentChatUser, setChatMessages  }  = useChatReducer();
  const {  ContextSocket } = useSocketReducer();

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const waveformRef = useRef<HTMLDivElement>(null);

  // Recording duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Initialize Wavesurfer
  useEffect(() => {
    if (!waveformRef.current) return;
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
      normalize: true,
    });
    ws.on("finish", () => {/* you can reset play state here */});
    setWaveform(ws);
    return () => ws.destroy();
  }, []);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    chunksRef.current = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mr = new MediaRecorder(stream);
        mediaRecorderRef.current = mr;
        audioRef.current!.srcObject = stream;

        mr.ondataavailable = e => chunksRef.current.push(e.data);
        mr.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
          const url = URL.createObjectURL(blob);
          setAudioBlob(blob);
          setRecordedAudioUrl(url);
          waveform!.load(url);
        };

        mr.start();
        setIsRecording(true);
      })
      .catch(console.error);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlay = () => {
    if (recordedAudioUrl && waveform) {
      setIsPlaying(true);
      waveform.play();
      audioRef.current!.play();
    }
  };
  const handlePause = () => {
    if (recordedAudioUrl && waveform) {

      setIsPlaying(false);
      waveform.pause();
      audioRef.current!.pause();
    }
  };

  const handleAudioSend = async () => {
    if (!audioBlob) {
      console.log("No audio recorded");
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append("audio", audioBlob, "audio.mp3");
      formdata.append("receiverId", currentChatUser?.id || "");
      formdata.append("senderId", data?.id || "");

      const res = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        setAudioBlob(null);
        setIsRecording(false);
        setRecordedAudioUrl(null);
        setWaveform(null);
        setRecordingDuration(0);
        
        hide();
        setChatMessages((prev: MessageType[]) => [...prev, res.data.msg]);
        ContextSocket?.emit("send-msg", {
          to: currentChatUser?.id,
          from: data.id,
          message: res.data.msg,
        });
      }
      console.log(res.data);
    } catch (err) {
      console.error("Audio send failed", err);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex text-2xl w-full justify-center items-center">
      <FaTrash onClick={hide} className="cursor-pointer  text-white" />
      <div className="mx-4 py-2 px-4 bg-search-input-container-background text-white rounded-full flex items-center gap-4 drop-shadow-lg">
        {isRecording
          ? <span className="text-red-500 animate-pulse">Recording {formatTime(recordingDuration)}</span>
          : (
            recordedAudioUrl && (

              <button >
                              {isPlaying ? <FaPause onClick={handlePause} className="cursor-pointer" /> : <FaPlay onClick={handlePlay} className="cursor-pointer"/>}

              </button>
            )
          )
        }
        <div ref={waveformRef} className="w-60" />
          <p>{formatTime(recordingDuration)}</p>
        {!isRecording
          ? <FaMicrophone onClick={handleStartRecording} className="cursor-pointer text-red-500" />
          : <FaStop onClick={handleStopRecording} className="cursor-pointer text-red-500" />
        }
        <MdSend onClick={handleAudioSend} className="cursor-pointer" title="Send recording" />
        <audio ref={audioRef} src={recordedAudioUrl || undefined} hidden />
      
      </div>
    </div>
  );
};

export default CaptureAudio;
