import react from "react";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";

export default function OpenChatButton({
  className,
  toggleChat,
  setToggleChat,
}: {
  className?: string;
  toggleChat: boolean;
  setToggleChat: React.Dispatch<boolean>;
}) {
  return (
    <button title="shareButton" className={`w-[30px] !${className}`}>
      <ChatBubbleLeftIcon
        width={30}
        className="p-1 rounded-sm bg-rose-400  text-xl hover:bg-rose-600"
        onClick={() => {
          setToggleChat(!toggleChat);
        }}
      />
    </button>
  );
}
