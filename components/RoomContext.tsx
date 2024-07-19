import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useReducer,
} from "react";
import Peer from "peerjs";
import socketIOClient from "socket.io-client";
import { useRouter } from "next/router";
import { ParticipantReducer } from "@/utils/participantReducer";
import { addParticipantAction } from "@/utils/participantActions";

const WS = "http://localhost:3031";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export default function RoomProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Peer>();
  const [participantId, setParticipantId] = useState<string>();
  const [stream, setStream] = useState<MediaStream>();
  const [participants, dispatch] = useReducer(ParticipantReducer, {});
  const enterRoom = ({
    roomId,
    userId,
    participantId,
  }: {
    roomId: string;
    userId: string;
    participantId: string;
  }) => {
    const peer = new Peer(participantId);
    setUser(peer);
    setParticipantId(participantId);
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
  const handleParticipantData = ({ participants }: { participants: any }) => {
    console.log(participants);
  };
  const handleDisconnect = ({
    meetingId,
    participantId,
  }: {
    meetingId: string;
    participantId: string;
  }) => {
    console.log("Participant disconnected ", participantId);
  };
  useEffect(() => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }
    ws.on("room-created", enterRoom);
    ws.on("create-user-afterJoin", createPeerAfterJoin);
    ws.on("get-users", handleParticipantData);
    ws.on("user-disconnected", handleDisconnect);
  }, []);
  useEffect(() => {
    if (!user) return;
    if (!stream) return;

    // initiate a call when a peer joins and send him your stream
    ws.on("participant-joined", (participantId) => {
      const call = user.call(participantId, stream);
      call.on("stream", (participantStream) => {
        dispatch(addParticipantAction(participantId, participantStream));
      });
    });

    // answer the call of the stream when you are called and answer using your stream and add his stream
    user.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (participantStream) => {
        dispatch(addParticipantAction(call.peer, participantStream));
      });
    });
  }, [user, stream]);

  return (
    <RoomContext.Provider value={{ ws, user, participantId, stream }}>
      {children}
    </RoomContext.Provider>
  );
}
