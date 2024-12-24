import { InCallMessageSent } from "@/utils/Interfaces/ChatInterface";

export const ADD_MESSAGE = "ADD_MESSAGE" as const;
export const ADD_MESSAGE_LIST = "ADD_MESSAGE_LIST" as const;
export const REMOVE_MESSAGE_LIST = "REMOVE_MESSAGE_LIST" as const;

export const addMessageToList = (message: InCallMessageSent) => ({
  type: ADD_MESSAGE,
  payload: { message },
});

export const addMessageList = (messageList: InCallMessageSent[]) => ({
  type: ADD_MESSAGE_LIST,
  payload: { messageList },
});

export const removeMessageFromList = (messageId: string) => ({
  type: REMOVE_MESSAGE_LIST,
  payload: {
    messageId,
  },
});
