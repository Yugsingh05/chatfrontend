import { calculateTime } from "@/utils/CalculateTime";
import { MessageType } from "./ChatContainer";
import MessageStatus from "./MessageStatus";

const ChatMessage = ({
  message,
  isOutgoing,
  userId,
}: {
  message: MessageType;
  isOutgoing: boolean;
  userId: string;
}) => {
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
          {/* Message text */}
          <span className="whitespace-pre-wrap break-words leading-relaxed">
            {message.message}
          </span>

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
