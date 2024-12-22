import React, { useState } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatModalSidebar({
  isOpen,
  toggleChat,
  messages,
}: {
  isOpen: boolean;
  toggleChat: React.Dispatch<boolean>;
  messages: { sender: string; text: string }[];
}) {
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
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[20%] bg-gray-900 text-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 z-50`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <p className="text-lg font-light">In-Call Messages</p>
        <button
          onClick={() => toggleChat(!isOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          ✖
        </button>
      </div>

      <div className="flex-1 overflow-y-scroll p-4 space-y-3 mb-10 h-[75%] ">
        {messages.map((msg, index) => (
          <ChatBubble message={msg.text} author={msg.sender} />
        ))}
      </div>

      <div className="fixed bottom-3 p-2 w-full bg-gray-800 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-700 text-white rounded focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="px-2 py-2 bg-blue-600 rounded hover:bg-blue-500 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
