import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { RoomContext } from "@/components/RoomContext";
import VideoPlayer from "@/components/VideoPlayer";

export default function RoomWithId() {
  const router = useRouter();
  const { ws, user, userId, stream, participantId } = useContext(RoomContext);
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
    <div>
      <VideoPlayer stream={stream} />
    </div>
  );
}
