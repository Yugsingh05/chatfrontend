import { calculateTime } from "@/utils/CalculateTime";
import { MessageType } from "./ChatContainer";
import MessageStatus from "./MessageStatus";

const ChatMessage = ({ message, isOutgoing , userId}: { message: MessageType; isOutgoing: boolean ,userId : string}) => {
  if (message.type === "text") {
    return (
      <div
        className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`px-3 py-2 rounded-lg text-sm flex gap-2 items-end max-w-xs md:max-w-md lg:max-w-lg 
          ${isOutgoing 
            ? "bg-outgoing-background text-white rounded-tr-none" 
            : "bg-incoming-background text-white rounded-tl-none"
          }`}
        >
          <span className="break-words whitespace-pre-wrap">{message.message}</span>
          <span className="text-bubble-meta text-xs self-end ml-1 min-w-fit whitespace-nowrap">
            {calculateTime(message.createdAt)}
          </span>
          <span>
            {message.senderId !== message.receiverId &&  <MessageStatus status={message.messageStatus}/>}
          </span>
        </div>
      </div>
    );
  }
  
  // Handle other message types here (images, files, etc.)
  return null;
};

export default ChatMessage