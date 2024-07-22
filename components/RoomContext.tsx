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
  const [isPeerOpen, setIsPeerOpen] = useState(false);
  const [participantId, setParticipantId] = useState("");
  const [userId, setUserId] = useState("");
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
    if (user) {
      return;
    }
    console.log("create peer");
    const peer = new Peer(participantId, {
      host: "localhost",
      port: 3030,
      path: "/peerjs",
      debug: 3,
    });
    setParticipantId(participantId);
    setUser(peer);
    peer.on("open", (id) => {
      console.log("Hiiii peer connected", id);
      setIsPeerOpen(true);
      ws.emit("user-ready-to-be-called", stream);
    });
    setUserId(userId);
    router.replace(`/room/${roomId}`);
  };
  const createPeerAfterJoin = ({
    userId,
    participantId,
  }: {
    userId: string;
    participantId: string;
  }) => {
    if (user) return;
    console.log("create peer after join");
    setParticipantId(participantId);
    const peer = new Peer(participantId, {
      host: "localhost",
      port: 3030,
      path: "/peerjs",
      debug: 3,
    });

    peer.on("open", (id) => {
      console.log("hii peer connected", id);
      setIsPeerOpen(true);
      ws.emit("user-ready-to-be-called", stream);
    });

    setUserId(userId);
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
    console.log("Participant disconnected  ", participantId);
  };

  // to recall peer participant
  const recallParticipant = (participantId: string) => {
    if (!user) {
      return;
    }
    if (!stream) {
      return;
    }
    const call = user.call(participantId, stream);
    console.log("call", call);
    if (call) {
      console.log("call ", call);
      call.on("stream", (participantStream) => {
        console.log("sream", participantStream);
        dispatch(addParticipantAction(participantId, participantStream));
      });
    } else {
      // ws.emit("call-to-peer-failed", {
      //   callerId: user.id,
      //   participantId: participantId,
      // });
    }
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
    ws.on("reinitiate-call", recallParticipant);
  }, []);

  useEffect(() => {
    if (!isPeerOpen) return;
    if (!stream) return;

    console.log("IsPeerOpen", isPeerOpen);
    // initiate a call when a peer joins and send him your stream
    const callPeer = (participantId: string) => {
      const call = user?.call(participantId, stream);
      console.log("call hii", call);
      if (call) {
        console.log("call on succees ", call);
        call.on("stream", (participantStream) => {
          console.log("sream", participantStream);
          dispatch(addParticipantAction(participantId, participantStream));
        });
      } else {
        // ws.emit("call-to-peer-failed", participantId);
      }
    };
    ws.on("participant-joined", callPeer);
    user?.on("disconnected", (id) => {
      console.log("hii disconnected yeah", id);
    });

    user?.on("call", (call) => {
      console.log("response to the call ");
      call.answer(stream);
      call.on("stream", (participantStream) => {
        dispatch(addParticipantAction(call.peer, participantStream));
      });
    });

    user?.on("error", (error) => {
      console.log("error peer", error);
    });
  }, [isPeerOpen, stream]);

  return (
    <RoomContext.Provider value={{ ws, user, stream, participantId, userId }}>
      {children}
    </RoomContext.Provider>
  );
}
