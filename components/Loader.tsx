import React from "react";

export default function Loader({
  size = "h-10 w-10",
  color = "border-blue-500",
  className = "",
}: {
  size?: string;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`border-4 border-t-transparent rounded-full animate-spin ${size} ${color} ${className}`}
    ></div>
  );
}
