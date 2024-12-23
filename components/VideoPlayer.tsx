import React, { useEffect, useRef } from "react";

export default function VideoPlayer({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <div className="border-white border-2 flex items-center justify-center w-full">
      <video
        ref={videoRef}
        autoPlay
        className="object-fill w-full"
        muted={true}
      ></video>
    </div>
  );
}
