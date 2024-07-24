import React, { useEffect, useRef } from "react";

export default function VideoPlayer({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <video ref={videoRef} autoPlay className="h-full" muted={true}></video>
  );
}
