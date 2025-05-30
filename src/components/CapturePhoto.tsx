import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

type Props = {
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setShowCapture: React.Dispatch<React.SetStateAction<boolean>>;
};

const CapturePhoto = ({ setImage, setShowCapture }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setShowCapture(false); // Close modal on error
      }
    };
    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [setShowCapture]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    // Set canvas size to video dimensions for better quality
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setImage(dataUrl);
      setShowCapture(false);
    }
  };


  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Capture photo modal"
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-auto"
    >
      <div className="relative bg-gray-900 rounded-lg w-full max-w-md mx-auto p-4 flex flex-col items-center">
        <button
          aria-label="Close capture photo"
          onClick={() => setShowCapture(false)}
          className="absolute top-2 right-2 text-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded bg-teal-400"
        >
          <IoClose className="h-8 w-8 " onClick={() => setShowCapture(false)} />
        </button>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-md max-h-[60vh] object-cover"
        ></video>

        <button
          onClick={capturePhoto}
          className="mt-6 h-16 w-16 rounded-full border-8 border-teal-400 bg-white shadow-lg hover:bg-teal-100 focus:outline-none focus:ring-4 focus:ring-teal-400"
          aria-label="Capture photo"
          title="Capture photo"
        />
      </div>
    </div>
  );
};

export default CapturePhoto;
