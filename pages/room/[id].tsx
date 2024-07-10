import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { RoomContext } from "@/components/RoomContext";

export default function RoomWithId() {
  const router = useRouter();
  const { ws, user } = useContext(RoomContext);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      if (user?._id) {
        ws.emit("join-room", { id: id, userId: user?._id });
      } else {
        ws.emit("create-user");
      }
    }
  }, [id, user, ws]);

  return <>fuck you</>;
}
