import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { RoomContext } from "@/components/RoomContext";
import VideoPlayer from "@/components/VideoPlayer";

export default function RoomWithId() {
  const router = useRouter();
  const { ws, user, participantId, stream } = useContext(RoomContext);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      if (user?._id) {
        ws.emit("join-room", { id: id, participantId, userId: user._id });
      } else {
        ws.emit("create-user");
      }
    }
  }, [id, user, ws]);

  return (
    <div>
      <VideoPlayer stream={stream} />
    </div>
  );
}
