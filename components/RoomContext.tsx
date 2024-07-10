import { createContext, ReactNode, useEffect, useState } from "react";
import Peer from "peerjs";
import socketIOClient from "socket.io-client";
import { useRouter } from "next/router";

const WS = "http://localhost:3031";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export default function RoomProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Peer>();
  const enterRoom = ({
    roomId,
    userId,
  }: {
    roomId: string;
    userId: string;
  }) => {
    console.log("room created, room id is:", roomId);
    console.log("userId is", userId);
    const peer = new Peer(userId);
    setUser(peer);
    router.replace(`/room/${roomId}`);
  };
  const createPeerAfterJoin = ({
    userId,
  }: {
    roomId: string;
    userId: string;
  }) => {
    const peer = new Peer(userId);
    setUser(peer);
  };
  useEffect(() => {
    ws.on("room-created", enterRoom);
    ws.on("create-user-afterJoin", createPeerAfterJoin);
  }, []);

  return (
    <RoomContext.Provider value={{ ws, user }}>{children}</RoomContext.Provider>
  );
}
