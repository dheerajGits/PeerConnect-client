import React, { useEffect, useRef } from "react";

export default function VideoPlayer({
  stream,
  fullWidth,
  className,
  videoClassName,
}: {
  stream: MediaStream;
  fullWidth: boolean;
  className?: string;
  videoClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <div
      className={`border-white border-2 flex items-center justify-center rounded-lg overflow-hidden ${
        fullWidth ? "w-full" : ""
      } !${className}`}
    >
      <video
        ref={videoRef}
        autoPlay
        className={` ${videoClassName}  rounded-lg object-contain w-full`}
        muted={true}
      ></video>
    </div>
  );
}
