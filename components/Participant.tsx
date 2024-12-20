import React from "react";
import {
  UserCircleIcon,
  VideoCameraIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/solid";

export default function Participant() {
  return (
    <div className="bg-[#5D6D7E] w-52  rounded-lg flex flex-col items-center justify-center">
      <UserCircleIcon color="#D6EAF8" className="h-48 w-48" />
      <div className="flex flex-row items-center justify-between gap-2">
        <MicrophoneIcon width={30} />
        <VideoCameraIcon width={30} />
      </div>
    </div>
  );
}
