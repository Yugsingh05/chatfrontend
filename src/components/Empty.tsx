import Image from 'next/image';
import React from 'react';

const Empty = () => {
  return (
    <div className="border-conversation-border border w-full bg-panel-header-background flex flex-col h-screen border-b-4 border-b-icon-green items-center justify-center z-10 px-4 text-center animate-fadeIn">
      <Image
        src="/logo.png"
        alt="Converssa Logo"
        width={250}
        height={250}
        className="mb-6 opacity-90"
      />
      <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold font-mono mb-3">
        Welcome to Converssa!
      </h2>
      <p className="text-white text-opacity-70 text-base sm:text-lg max-w-md">
        Start a conversation by selecting a chat or creating a new one. Your messages will appear here.
      </p>
    </div>
  );
};

export default Empty;
