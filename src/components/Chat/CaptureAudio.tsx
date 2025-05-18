import React, { useRef, useState } from "react";
import { FaMicrophone, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";

const CaptureAudio = ({ hide }) => {
  const [IsRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordAudio] = useState(null);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveformRef = useRef(null);

  const handlePLay = () => {};
  const handlePause = () => {};

  const handleStartRecording = () => {};
  const handleStopRecording = () => {};
  

  const handleSendRecording  = async() =>{};

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className="text-panel-header-icon " onClick={hide} />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {IsRecording ? (
          <div className="text-red-500 animate-pulse w-60 text-center">
            Recording <span>{recordingDuration}</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePLay} />
                ) : (
                  <FaStop onClick={handlePause} />
                )}
              </>
            )}
          </div>
        )}

        <div className="w-60" ref={waveformRef} hidden={IsRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlayBackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
        <div className="mr-4">
          {!IsRecording ? (
            <FaMicrophone
              onClick={handleStartRecording}
              className="cursor-pointer text-red-500"
            />
          ) : (
            <FaStop
              onClick={handleStopRecording}
              className="cursor-pointer text-red-500"
            />
          )}
        </div>
        <div>
            <MdSend 
            className="cursor-pointer"
            title="send Recording"
             onClick={handleSendRecording}/>
           
        </div>
      </div>
    </div>
  );
};

export default CaptureAudio;
