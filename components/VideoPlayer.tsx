import React, { useEffect, useRef } from "react";

export default function VideoPlayer({
  stream,
  fullWidth,
}: {
  stream: MediaStream;
  fullWidth: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <div
      className={`border-white border-2 flex items-center justify-center h-[90%]  ${
        fullWidth ? "w-full" : ""
      }`}
    >
      <video ref={videoRef} autoPlay className="h-[90%]" muted={true}></video>
    </div>
  );
}
