import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import MessageStatus from "./MessageStatus";
import { calculateTime } from "@/utils/CalculateTime";

function AudioMessage({ message, isOutgoing }: any) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Attach media event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} px-4 py-2`}>
      <div
        className={`relative px-4 py-3 rounded-xl text-sm w-fit max-w-[80%] flex flex-col gap-2
          ${isOutgoing
            ? "bg-outgoing-background text-white rounded-tr-md rounded-br-none"
            : "bg-incoming-background text-white rounded-tl-md rounded-bl-none"
          } shadow-md`}
      >
        {/* Controls & Progress */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayback}
            className="p-1 hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={onSeek}
            className="flex-1 h-1 rounded-lg bg-gray-300 accent-blue-400 cursor-pointer"
          />
          <span className="whitespace-nowrap text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} preload="metadata">
          <source
            src={`http://localhost:3005/${message.message}`}
            type="audio/mpeg"
          />
          Your browser does not support the audio element.
        </audio>

        {/* Timestamp + Status */}
        <div className="flex items-center justify-end gap-1 text-xs text-bubble-meta mt-1">
          <span className="whitespace-nowrap">
            {calculateTime(message.createdAt)}
          </span>
          {message.senderId !== message.receiverId && (
            <MessageStatus status={message.messageStatus} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioMessage;
