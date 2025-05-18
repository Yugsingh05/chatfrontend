import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

const CaptureAudio = ({ hide }) => {
  const [IsRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const waveformRef = useRef(null);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (IsRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [IsRecording]);

  //3b82f6  2563eb
  useEffect(() => {
    if (!waveformRef.current) return;

    const waveSurfer = WaveSurfer.create({
      container: waveformRef.current as HTMLElement,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
      normalize: true,
    });

    setWaveform(waveSurfer);

    waveSurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => waveSurfer.destroy();
  }, []);

  useEffect(() => {
    if (recordedAudio) {
      const updatePlayBackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlayBackTime);

      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlayBackTime);
      };
    }
  }, [recordedAudio]);

  const handlePLay = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };
  const handlePause = () => {
    if (recordedAudio) {
      waveform.stop();
      recordedAudio.pause();
      setIsPlaying(false);
    }
  };

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks: BlobPart[] | undefined = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordAudio(audio);

          waveform.load(audioUrl);
        };

        mediaRecorder.start();
      })
      .catch((err) => console.log("Error Accesing the microphone ", err));
  };

  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && IsRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();

      const audioChunks: BlobPart[] | undefined = [];
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        (e: { data: BlobPart }) => audioChunks.push(e.data)
      );

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        setRecordAudio(audio);
        waveform.load(audioUrl);
      });
    }
  };

  const handleSendRecording = async () => {};

  const formatTime = (time: number) => {
    if (!isNaN(time)) {
      return "00:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${
      seconds < 10 ? "0" : ""
    }${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className="text-panel-header-icon cursor-pointer " onClick={hide} />
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
                  <FaPlay onClick={handlePLay} className="cursor-pointer" />
                ) : (
                  <FaStop onClick={handlePause} className="cursor-pointer" />
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
            onClick={handleSendRecording}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptureAudio;
