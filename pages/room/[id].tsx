import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { RoomContext } from "@/components/RoomContext";
import VideoPlayer from "@/components/VideoPlayer";
import { ParticipantState } from "../../utils/participantReducer";

export default function RoomWithId() {
  const router = useRouter();
  const { ws, user, userId, stream, participantId, participants } =
    useContext(RoomContext);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      if (!participantId) {
        console.log("creating attendee");
        ws.emit("create-attendee-and-join", { meetingId: id });
      }
    }
  }, [id, ws]);

  return (
    <div className="grid grid-cols-4 gap-2">
      <VideoPlayer stream={stream} />
      {Object.values(participants as ParticipantState).map((peer) => {
        return <VideoPlayer stream={peer.stream} />;
      })}
    </div>
  );
}
