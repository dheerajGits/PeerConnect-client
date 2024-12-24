import {
  InCallMessageRecieved,
  InCallMessageSent,
} from "@/utils/Interfaces/ChatInterface";
import {
  ADD_MESSAGE,
  ADD_MESSAGE_LIST,
  REMOVE_MESSAGE_LIST,
} from "./ChatActions";

export type MessageList = Record<
  string,
  { messageContent: InCallMessageRecieved }
>;

type ChatActions =
  | {
      type: typeof ADD_MESSAGE;
      payload: { messageId: string; message: InCallMessageRecieved };
    }
  | {
      type: typeof ADD_MESSAGE_LIST;
      payload: {
        messageList: Record<string, { messageContent: InCallMessageRecieved }>;
      };
    }
  | {
      type: typeof REMOVE_MESSAGE_LIST;
      payload: { messageId: string };
    };
export const ChatReducers = (
  state: MessageList,
  action: ChatActions
): MessageList => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        [action.payload.messageId]: { messageContent: action.payload.message },
      };

    case ADD_MESSAGE_LIST:
      return {
        ...state,
      };

    case REMOVE_MESSAGE_LIST:
      const { [action.payload.messageId]: deleted, ...rest } = state;
      return rest;

    default:
      return { ...state };
  }
};
