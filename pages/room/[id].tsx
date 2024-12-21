import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { RoomContext } from "@/components/RoomContext";
import VideoPlayer from "@/components/VideoPlayer";
import { ParticipantState } from "../../utils/participantReducer";
import ShareScreenButton from "@/components/ShareScreenButton";

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
    <div className=" flex flex-col items-center justify-between bg-[#110f14] h-screen w-full">
      <div
        className={`${
          participants.length && participants.length > 4
            ? "grid grid-cols-4 gap-2"
            : "flex justify-center gap-2"
        } h-[90%] w-full`}
      >
        <VideoPlayer stream={stream} />
        {Object.values(participants as ParticipantState).map((peer, index) => {
          return <VideoPlayer stream={peer.stream} key={index} />;
        })}
      </div>
      <div className="fixed bottom-2 border-t-2 w-full p-2 flex justify-center">
        <ShareScreenButton />
      </div>
    </div>
  );
}
