import "@/styles/globals.css";
import type { AppProps } from "next/app";
import RoomProvider from "@/components/RoomContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RoomProvider>
      {" "}
      <Component {...pageProps} />
    </RoomProvider>
  );
}
