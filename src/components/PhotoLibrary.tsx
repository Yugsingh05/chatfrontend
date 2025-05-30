import Image from "next/image";
import React from "react";
import { IoClose } from "react-icons/io5";

type Props = {
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setShowLibrary: React.Dispatch<React.SetStateAction<boolean>>;
};

const PhotoLibrary = ({ setImage, setShowLibrary }: Props) => {
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select photo from library"
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-2 sm:p-4 z-50"
    >
      <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto shadow-xl ring-1 ring-black ring-opacity-10 max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 flex-shrink-0">
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">
            Choose Your Avatar
          </h2>
          <button
            onClick={() => setShowLibrary(false)}
            aria-label="Close photo library"
            className="text-gray-300 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full transition p-1"
          >
            <IoClose className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        </div>

        {/* Scrollable Images Grid Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 pb-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setImage(image);
                  setShowLibrary(false);
                }}
                className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-teal-400 focus:outline-none focus:border-teal-400 transition-all duration-200 transform hover:scale-105 active:scale-95"
                aria-label={`Select avatar ${index + 1}`}
                type="button"
              >
                <Image
                  src={image}
                  alt={`Avatar ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                  priority={index < 6} // preload first 6 images for better UX
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoLibrary;