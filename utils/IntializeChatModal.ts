import socketIOClient, { Socket } from "socket.io-client";
import { InCallMessage } from "./Interfaces/ChatInterface";
import dayjs from "dayjs";
export function IntializeChatModal({ socket }: { socket: Socket }) {}
export function sendMessage(
  socket: Socket,
  messageContent: string,
  participantId: string,
  roomId: string
) {
  const messageBody: InCallMessage = {
    participantId: participantId,
    message: messageContent,
    timeStamp: dayjs(),
  };
  socket.emit("send-message", roomId, messageBody); // send the message to the server where it will be broadcasted
}
