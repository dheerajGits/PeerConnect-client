import socketIOClient, { Socket } from "socket.io-client";
import { InCallMessageSent } from "./Interfaces/ChatInterface";
import dayjs from "dayjs";
export function IntializeChatModal({ socket }: { socket: Socket }) {}
export function sendMessage(
  socket: Socket,
  messageContent: string,
  participantId: string,
  roomId: string
) {
  const messageBody: InCallMessageSent = {
    participantId: participantId,
    message: messageContent,
    timeStamp: dayjs(),
  };
  console.log(messageBody);
  socket.emit("send-message", roomId, messageBody); // send the message to the server where it will be broadcasted
}
