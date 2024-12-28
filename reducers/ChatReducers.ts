import {
  InCallMessageRecieved,
  InCallMessageSent,
} from "@/utils/Interfaces/ChatInterface";
import {
  ADD_MESSAGE,
  ADD_MESSAGE_LIST,
  REMOVE_MESSAGE_LIST,
} from "./ChatActions";

export type ChatList = InCallMessageRecieved[];

type ChatActions =
  | {
      type: typeof ADD_MESSAGE;
      payload: { message: InCallMessageRecieved };
    }
  | {
      type: typeof ADD_MESSAGE_LIST;
      payload: {
        messageList: InCallMessageRecieved[];
      };
    }
  | {
      type: typeof REMOVE_MESSAGE_LIST;
      payload: { messageId: string };
    };
export const ChatReducers = (
  state: ChatList,
  action: ChatActions
): ChatList => {
  switch (action.type) {
    case ADD_MESSAGE:
      return [...state, action.payload.message];

    case ADD_MESSAGE_LIST:
      return [...state];

    case REMOVE_MESSAGE_LIST:
      const rest: InCallMessageRecieved[] = [];
      state.forEach((message: InCallMessageRecieved) => {
        if (message.id != action.payload.messageId) {
          rest.push(message);
        }
      });
      return rest;

    default:
      return { ...state };
  }
};
