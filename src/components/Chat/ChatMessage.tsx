import { calculateTime } from "@/utils/CalculateTime";
import { MessageType } from "./ChatContainer";
import MessageStatus from "./MessageStatus";
import Image from "next/image";
import { HOST } from "@/utils/ApiRoutes";

const ChatMessage = ({
  message,
  isOutgoing,
  userId,
}: {
  message: MessageType;
  isOutgoing: boolean;
  userId: string;
}) => {
  if (message.type === "image") {
    return (
      <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} px-4 py-1`}>
        <div
          className={`relative p-2 rounded-xl w-fit max-w-[80%] transition
            ${isOutgoing
              ? "bg-outgoing-background text-white rounded-tr-md rounded-br-none"
              : "bg-incoming-background text-white rounded-tl-md rounded-bl-none"
            } shadow-sm`}
        >
          <Image
            src={`${HOST}/${message.message}`}
            alt="image"
            width={200}
            height={200}
            className="rounded-md object-cover"
          />

          {/* Timestamp + Status */}
          <div className="flex items-center justify-end gap-1 text-xs text-bubble-meta mt-1">
            <span className="whitespace-nowrap">{calculateTime(message.createdAt)}</span>
            {message.senderId !== message.receiverId && (
              <MessageStatus status={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "text") {
    return (
      <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} px-4 py-1`}>
        <div
          className={`relative px-4 py-2 rounded-xl text-sm w-fit max-w-[80%] flex flex-col gap-1 transition
            ${isOutgoing
              ? "bg-outgoing-background text-white rounded-tr-md rounded-br-none"
              : "bg-incoming-background text-white rounded-tl-md rounded-bl-none"
            } shadow-sm`}
        >
          <span className="whitespace-pre-wrap break-words leading-relaxed">
            {message.message}
          </span>

          {/* Timestamp + Status */}
          <div className="flex items-center justify-end gap-1 text-xs text-bubble-meta mt-1">
            <span className="whitespace-nowrap">{calculateTime(message.createdAt)}</span>
            {message.senderId === userId && (
              <MessageStatus status={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    );
  }

if (message.type === "audio") {

  
    return (
      <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} px-4 py-1`}>
        <div
          className={`relative px-4 py-2 rounded-xl text-sm w-fit max-w-[80%] flex flex-col gap-1 transition
            ${isOutgoing
              ? "bg-outgoing-background text-white rounded-tr-md rounded-br-none"
              : "bg-incoming-background text-white rounded-tl-md rounded-bl-none"
            } shadow-sm`}
        >
          <audio controls>
            <source src={`${HOST}/${message.message}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          {/* Timestamp + Status */}
          <div className="flex items-center justify-end gap-1 text-xs text-bubble-meta mt-1">
            <span className="whitespace-nowrap">{calculateTime(message.createdAt)}</span>
            {message.senderId !== message.receiverId && (
              <MessageStatus status={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default ChatMessage;
