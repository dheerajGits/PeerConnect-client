import React, { useContext } from "react";
import { RoomContext } from "./RoomContext";

export default function JoinButton({}) {
  const { ws, setStartWebSocketConnection } = useContext(RoomContext);
  const joinRoom = () => {
    setStartWebSocketConnection(true);
    ws.emit("create-room", {
      participantName: "",
    });
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
