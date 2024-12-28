import React, { useContext, useState } from "react";
import ChatBubble from "./ChatBubble";
import { ChevronDoubleLeftIcon } from "@heroicons/react/16/solid";
import { RoomContext } from "@/components/RoomContext";
import ChatSendInputBar from "./ChatSendInputBar";
import { useRouter } from "next/router";
import { InCallMessageRecieved } from "@/utils/Interfaces/ChatInterface";
import { ChatList } from "@/reducers/ChatReducers";

export default function ChatModalSidebar({
  isOpen,
  toggleChat,
  messages,
}: {
  isOpen: boolean;
  toggleChat: React.Dispatch<boolean>;
  messages: { sender: string; text: string }[];
}) {
  const { ws, participantId, chats } = useContext(RoomContext);
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
        {chats.map((chat: any, index: number) => {
          console.log(chat);
          return <ChatBubble chat={chat} />;
        })}
      </div>

      <ChatSendInputBar isOpen={isOpen} />
    </div>
  );
}
