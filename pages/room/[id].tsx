import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RoomContext } from "@/components/RoomContext";
import VideoPlayer from "@/components/VideoPlayer";
import { ParticipantState } from "../../utils/participantReducer";
import ShareScreenButton from "@/components/ShareScreenButton";
import OpenChatButton from "@/components/OpenChatButton";
import ChatModalSidebar from "@/components/ChatModalSidebar";

export default function RoomWithId() {
  const router = useRouter();
  const { ws, user, userId, stream, participantId, participants } =
    useContext(RoomContext);
  const [openChatModal, setOpenChatModal] = useState<boolean>(false);
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
    <div className="relative flex flex-col items-center justify-between bg-[#110f14] h-screen w-full">
      <div
        className={`${
          Object.values(participants as ParticipantState) &&
          Object.values(participants as ParticipantState).length > 4
            ? "grid grid-cols-4 gap-2"
            : "flex items-center justify-center gap-2"
        } h-[90%] w-full`}
      >
        <VideoPlayer stream={stream} />
        {Object.values(participants as ParticipantState).map((peer, index) => {
          return <VideoPlayer stream={peer.stream} key={index} />;
        })}
      </div>
      <ChatModalSidebar
        isOpen={openChatModal}
        toggleChat={setOpenChatModal}
        messages={[]}
      />
      <div className="fixed bottom-2 border-t-2 w-full p-2 flex justify-center items-center gap-2">
        <ShareScreenButton />
        <OpenChatButton
          toggleChat={openChatModal}
          setToggleChat={setOpenChatModal}
        />
      </div>
    </div>
  );
}
