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
import { Socket } from "dgram";

const WS = "http://localhost:3031";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(WS);

export default function RoomProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isPeerSetting = useRef<boolean>(false); // to cater double peer creation problem
  const [user, setUser] = useState<Peer>();
  const [isPeerOpen, setIsPeerOpen] = useState(false);
  const [participantId, setParticipantId] = useState("");
  const [userId, setUserId] = useState("");
  const [stream, setStream] = useState<MediaStream>();
  const [participants, dispatch] = useReducer(ParticipantReducer, {});

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
      console.log("creating room");
      isPeerSetting.current = true;
      setUserId(User);
      setParticipantId(participant);
      const peer = new Peer(participant, {
        host: "localhost",
        port: 3030,
        path: "/peerjs",
      });
      initializePeer(peer, ws);
      setUser(peer);
      router.replace(`/room/${roomId}`);
    },
    [user, isPeerSetting, ws, router]
  );

  const initializePeer = (peer: Peer, ws: any) => {
    // to set the availabiltity of the peer
    peer.on("open", (id) => {
      setIsPeerOpen(true);
    });
    const callPeer = (participantId: string, stream: MediaStream) => {
      console.log("calling peer");
      const call = peer?.call(participantId, stream);
      console.log(call);
      call?.on("stream", (participantStream) => {
        dispatch(addParticipantAction(participantId, participantStream));
      });
    };
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((Stream) => {
        setStream(Stream);
        ws.on("participant-joined", (participantId: string) => {
          callPeer(participantId, Stream);
        });
        user?.on("disconnected", (id) => {
          console.log("Peer disconnected", id);
        });
        user?.on("call", (call) => {
          call.answer(stream);
          console.log("got call");
          call.on("stream", (participantStream) => {
            dispatch(addParticipantAction(call.peer, participantStream));
          });
        });
        user?.on("error", (error) => {
          console.log("error peer", error);
        });
        ws.emit("user-ready-to-be-called");
      });
  };

  // to add the other person to the room
  const createPeerAfterJoin = useCallback(
    async ({ User, participant }: { User: string; participant: string }) => {
      if (user || participantId || userId || isPeerSetting.current) return;
      isPeerSetting.current = true;

      setParticipantId(participant);
      setUserId(User);
      console.log("Creating peer after join");

      const peer = new Peer(participant, {
        host: "localhost",
        port: 3030,
        path: "/peerjs",
      });
      initializePeer(peer, ws);
      setUser(peer);
    },
    [user, participantId, userId, stream]
  );

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
    console.log(
      "Participant disconnected with id:",
      participantId,
      "from meeting with Id: ",
      meetingId
    );
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
    } catch (error) {
      console.error(error);
    }
    ws.on("room-created", enterRoom);
    ws.on("create-user-afterJoin", createPeerAfterJoin);
    ws.on("get-users", handleParticipantData);
    ws.on("user-disconnected", handleDisconnect);
    ws.on("reinitiate-call", recallParticipant);
    ws.on("error", (e) => {
      console.log(e);
    });
  }, []);

  useEffect(() => {
    if (!isPeerOpen) return;
    if (!stream) return;

    // initiate a call when a peer joins and send him your stream
    const callPeer = (participantId: string) => {
      console.log("calling peer");
      const call = user?.call(participantId, stream);
      call?.on("stream", (participantStream) => {
        dispatch(addParticipantAction(participantId, participantStream));
      });
    };
    ws.on("participant-joined", callPeer);
    user?.on("disconnected", (id) => {
      console.log("Peer disconnected", id);
    });

    user?.on("call", (call) => {
      call.answer(stream);
      console.log("got call");
      call.on("stream", (participantStream) => {
        dispatch(addParticipantAction(call.peer, participantStream));
      });
    });

    user?.on("error", (error) => {
      console.log("error peer", error);
    });
  }, [isPeerOpen, stream]);

  return (
    <RoomContext.Provider
      value={{ ws, user, stream, participantId, userId, participants }}
    >
      {children}
    </RoomContext.Provider>
  );
}
