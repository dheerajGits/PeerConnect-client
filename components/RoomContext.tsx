import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useReducer,
  useRef,
  useCallback,
} from "react";
import Peer from "peerjs";
import socketIOClient from "socket.io-client";
import { useRouter } from "next/router";
import { ParticipantReducer } from "@/utils/participantReducer";
import {
  addParticipantAction,
  removeParticipantAction,
} from "@/utils/participantActions";
import axios from "axios";

const WS = "http://localhost:3030";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export default function RoomProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isPeerSetting = useRef<boolean>(false);
  const [user, setUser] = useState<Peer>();
  const [isPeerOpen, setIsPeerOpen] = useState(false);
  const [participantId, setParticipantId] = useState("");
  const [userId, setUserId] = useState("");
  const [stream, setStream] = useState<MediaStream>();
  const [participants, dispatch] = useReducer(ParticipantReducer, {});

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
    ws.on("error", (e) => {
      console.log("[Error]", e);
    });
  }, []);

  useEffect(() => {
    if (!isPeerOpen) return;

    if (!stream) return;

    if (!user) return;

    // initiate a call when a peer joins and send him your stream
    const callPeer = (participantId: string) => {
      if (participantId == user.id) return; // calling itself
      const call = user?.call(participantId, stream);
      if (call) {
        call.on("stream", (participantStream) => {
          dispatch(addParticipantAction(participantId, participantStream));
        });
      } else {
        // ws.emit("call-to-peer-failed", participantId);
      }
    };
    ws.on("participant-joined", callPeer);
    user.on("disconnected", (id) => {
      console.log("[PEER DISCONNECTED]", id);
    });

    user.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (participantStream) => {
        dispatch(addParticipantAction(call.peer, participantStream));
      });
      call.on("error", (e) => {
        console.log("[ERROR DURING CALL]", e);
      });
    });
    user.on("disconnected", () => {
      console.log("[PEER DISCONNECTED]");
    });

    user?.on("error", (error) => {
      console.log("[ERROR PEER]", error);
    });
    ws.emit("user-ready-to-be-called");
    setIsPeerOpen(false);
  }, [isPeerOpen, stream, user]);

  // to create the first attendee(host), or the one which creats the room
  const enterRoom = useCallback(
    ({
      roomId,
      User,
      participant,
    }: {
      roomId: string;
      User: string;
      participant: string;
    }) => {
      if (user || isPeerSetting.current) return;

      isPeerSetting.current = true;
      setUserId(User);
      setParticipantId(participant);
      const peer = new Peer(participant, {
        host: "localhost",
        port: 8080,
        path: "/peerjs",
        debug: 3,
      });
      setUser(peer);
      peer.on("open", (id) => {
        setIsPeerOpen(true);
      });
      router.replace(`/room/${roomId}`);
    },
    [user, isPeerSetting, ws, router]
  );

  // to add the other person to the room
  const createPeerAfterJoin = useCallback(
    ({ User, participant }: { User: string; participant: string }) => {
      if (user || participantId || userId || isPeerSetting.current) return;
      isPeerSetting.current = true;

      setParticipantId(participant);
      setUserId(User);

      const peer = new Peer(participant, {
        host: "localhost",
        port: 8080,
        path: "/peerjs",
        debug: 3,
      });
      setUser(peer);
      peer.on("open", (id) => {
        setIsPeerOpen(true);
        ws.emit("user-ready-to-be-called", participant);
      });
    },
    [user, participantId, userId, stream]
  );

  const handleParticipantData = ({ participants }: { participants: any }) => {
    // console.log(participants);
  };
  const handleDisconnect = ({
    meetingId,
    participantId,
  }: {
    meetingId: string;
    participantId: string;
  }) => {
    console.log("[PARTICIPANT DISCONNECTED]", participantId);
    dispatch(removeParticipantAction(participantId));
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
    if (call) {
      call.on("stream", (participantStream) => {
        dispatch(addParticipantAction(participantId, participantStream));
      });
    } else {
      // ws.emit("call-to-peer-failed", {
      //   callerId: user.id,
      //   participantId: participantId,
      // });
    }
  };

  return (
    <RoomContext.Provider
      value={{ ws, user, stream, participantId, userId, participants }}
    >
      {children}
    </RoomContext.Provider>
  );
}
