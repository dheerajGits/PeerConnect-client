import { Dayjs } from "dayjs";

export interface InCallMessageSent {
  participantId: string;
  message: string;
  timeStamp: Dayjs;
}

export interface InCallMessageRecieved {
  id: string;
  message: string;
  timeStamp: Dayjs;
  participantId: string;
}
