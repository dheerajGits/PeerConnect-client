import React, { useContext, useState } from "react";
import ChatBubble from "./ChatBubble";
import { ChevronDoubleLeftIcon } from "@heroicons/react/16/solid";
import { sendMessage } from "@/utils/IntializeChatModal";
import { RoomContext } from "@/components/RoomContext";

export default function ChatModalSidebar({
  isOpen,
  toggleChat,
  messages,
}: {
  isOpen: boolean;
  toggleChat: React.Dispatch<boolean>;
  messages: { sender: string; text: string }[];
}) {
  const { ws, participantId, roomId } = useContext(RoomContext);

  const [newMessage, setNewMessage] = useState("");
  // dummy messages for testing
  messages = [
    { sender: "Dheeraj", text: "Hiii" },
    { sender: "Dheeraj", text: "Hiii" },
    { sender: "Dheeraj", text: "Hiii" },
    { sender: "Dheeraj", text: "Hiii" },
    { sender: "Dheeraj", text: "Hiii" },
    { sender: "Dheeraj", text: "Hiii" },
    { sender: "Dheeraj", text: "Hiii" },
    { sender: "Dheeraj", text: "Hiii" },
    { sender: "Dheeraj", text: "Hiii" },
    { sender: "Dheeraj", text: "Hiii" },
  ];

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setNewMessage("");
      return;
    }
    sendMessage(ws, newMessage, participantId, roomId);
    setNewMessage("");
  };

  return (
    <div
      className={`fixed top-3 right-0 bottom-6 w-[25%] bg-gray-600 text-white shadow-lg transform rounded-xl ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 z-50`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-600 border-b border-gray-700 min-h-20 rounded-xl rounded-r-none">
        <p className="text-xl font-semibold">In-Call Messages</p>
        <button
          title="open-button"
          onClick={() => toggleChat(!isOpen)}
          className="text-gray-800 hover:text-white focus:outline-none"
        >
          <ChevronDoubleLeftIcon
            color="white"
            className="rotate-180 hover:w-8  w-6 duration-300"
          />
        </button>
      </div>

      <div
        className="flex-1 overflow-y-scroll p-4 space-y-3 mb-10 h-[75%] scrollbar-width:none"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {messages.map((msg, index) => (
          <ChatBubble message={msg.text} author={msg.sender} />
        ))}
      </div>

      <div className="fixed bottom-0 p-2 w-full bg-gray-800 border-t border-gray-700 rounded-xl rounded-t-none">
        <form
          className="flex items-center gap-2"
          onSubmit={(e: any) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-700 text-white rounded focus:outline-none"
          />
          <button className="px-2 py-2 bg-blue-600 rounded hover:bg-blue-500 focus:outline-none">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
