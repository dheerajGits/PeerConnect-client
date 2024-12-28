// import { sendMessage } from "@/utils/";
import React, { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { RoomContext } from "./RoomContext";
import { useRouter } from "next/router";

export default function ChatSendInputBar({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const roomId = router.query.id as string;

  useEffect(() => {
    if (isOpen) document.getElementById("inputfield")?.focus();
  }, [isOpen]);
  const { ws, participantId, Chat, chats } = useContext(RoomContext);

  const [newMessage, setNewMessage] = useState("");
  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setNewMessage("");
      Chat.sendMessage(newMessage, participantId, roomId);
      return;
    }
  };

  return (
    <div className="fixed bottom-0 p-2 w-full bg-gray-800 border-t border-gray-700 rounded-xl rounded-t-none">
      <form
        className="flex items-center gap-2"
        onSubmit={(e: any) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          id="inputfield"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-gray-700 text-white rounded autofocus focus:outline-none"
        />
        <button className="px-2 py-2 bg-blue-600 rounded hover:bg-blue-500 focus:outline-none">
          Send
        </button>
      </form>
    </div>
  );
}
