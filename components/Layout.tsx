import {
  ComputerDesktopIcon,
  MicrophoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/16/solid";
import React, { ReactNode } from "react";

export default function Layout({
  meetingName,
  children,
}: {
  meetingName: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <header>
        <div>
          <p className="text-lg">{meetingName}</p>
        </div>
      </header>
      {children}
      <footer>
        {" "}
        <ComputerDesktopIcon
          width={30}
          className="p-1 rounded-sm bg-rose-400  text-xl hover:bg-rose-600"
        />
        <MicrophoneIcon width={30} />
        <VideoCameraIcon width={30} />
      </footer>
    </div>
  );
}
