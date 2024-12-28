import socketIOClient, { Socket } from "socket.io-client";
import {
  InCallMessageRecieved,
  InCallMessageSent,
} from "./Interfaces/ChatInterface";
import dayjs from "dayjs";
import axios from "axios";

class ChatModule {
  public socket: Socket;
  public addMessageReducer: (message: InCallMessageRecieved) => void;

  public addMessageListReducer: (messageList: InCallMessageRecieved[]) => void;

  public removeMessageReducer: (messageId: string) => void;

  constructor(
    socket: Socket,
    addMessageReducer: (message: InCallMessageRecieved) => void,
    addMessageListReducer: (messageList: InCallMessageRecieved[]) => void,
    removeMessageReducer: (messageId: string) => void
  ) {
    this.socket = socket;

    this.addMessageReducer = (message: InCallMessageRecieved) => {
      addMessageReducer(message);
    };

    this.addMessageListReducer = (messageList: InCallMessageRecieved[]) => {
      addMessageListReducer(messageList);
    };

    this.removeMessageReducer = (messageId: string) => {
      removeMessageReducer(messageId);
    };
  }

  public intializeChatModal = () => {
    // this will help in recieving the message from the server
    this.socket.on("message-recieved", (messageBody: InCallMessageRecieved) => {
      this.addMessageReducer(messageBody);
    });
  };

  public sendMessage = async (
    messageContent: string,
    participantId: string,
    roomId: string
  ) => {
    let messageBody = {
      participantId: participantId,
      message: messageContent,
      roomId: roomId,
    };
    // first we will register the message using api and then we will send the message to the using websocket to broadcast it to the peers
    try {
      const message = await axios.post(
        "http://localhost:3030/attendees/add-chat",
        messageBody
      );
      const messageResponse: InCallMessageRecieved = {
        id: message.data.data.id,
        timeStamp: dayjs(),
        participantId: participantId,
        message: messageContent,
      };
      this.addMessageReducer(messageResponse);
      this.socket.emit("send-message", roomId, messageBody);
    } catch (e) {
      console.log("error", e);
    }
    // send the message to the server where it will be broadcasted
  };
}

export default ChatModule;
