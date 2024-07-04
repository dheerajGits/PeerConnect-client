import Image from "next/image";
import { Inter } from "next/font/google";
import JoinButton from "@/components/JoinButton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex  items-center justify-center h-screen w-screen">
      <JoinButton></JoinButton>
    </main>
  );
}
