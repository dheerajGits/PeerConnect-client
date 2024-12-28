import React, { useContext } from "react";
import dayjs from "dayjs";
import { RoomContext } from "./RoomContext";
import { InCallMessageRecieved } from "@/utils/Interfaces/ChatInterface";

export default function ChatBubble({ chat }: { chat: InCallMessageRecieved }) {
  const { participantId } = useContext(RoomContext);

  return (
    <div
      className={`flex flex-row ${
        participantId == chat.participantId ? "justify-end" : ""
      }`}
    >
      <div
        className={`min-h-10 p-2 flex flex-col rounded-lg bg-gray-500 w-[65%] `}
      >
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-semibold">
            {chat.participantId.substring(0, 10)}
          </p>
          <p className="text-sm">{chat?.timeStamp?.format("hh:mm a")}</p>
        </div>
        <div className="text-md font-light">{chat.message}</div>
      </div>
    </div>
  );
}
