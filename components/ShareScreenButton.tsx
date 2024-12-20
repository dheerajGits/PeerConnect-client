import react from "react";
import { ComputerDesktopIcon } from "@heroicons/react/24/solid";

export default function ShareScreenButton({
  className,
}: {
  className?: string;
}) {
  return (
    <button title="shareButton" className={`w-[30px] !${className}`}>
      <ComputerDesktopIcon
        width={30}
        className="p-1 rounded-sm bg-rose-400  text-xl hover:bg-rose-600"
      />
    </button>
  );
}
