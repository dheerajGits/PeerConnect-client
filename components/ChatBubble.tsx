import React from "react";
import dayjs from "dayjs";

export default function ChatBubble({
  author,
  message,
}: {
  author: string;
  message: string;
}) {
  return (
    <div className="min-h-10 p-2 flex flex-col rounded-lg bg-gray-500 w-[95%]">
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm font-semibold">{author}</p>
        <p className="text-sm">{dayjs().format("hh:mm a")}</p>
      </div>
      <div className="text-md font-light">{message}</div>
    </div>
  );
}
