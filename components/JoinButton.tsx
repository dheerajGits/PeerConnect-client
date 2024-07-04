import React, { useContext } from "react";
import { RoomContext } from "./RoomContext";

export default function JoinButton({}) {
  const { ws } = useContext(RoomContext);
  const joinRoom = () => {
    console.log("hii");
    ws.emit("create-room");
  };
  return (
    <button
      className="px-8 py-2 bg-rose-400 rounded-lg text-xl hover:bg-rose-600"
      onClick={joinRoom}
    >
      Start New Meeting
    </button>
  );
}
