import { ADD_PARTICIPANT, REMOVE_PARTICIPANT } from "./participantActions";

type participantState = Record<string, { stream: MediaStream }>;

type participantAction =
  | {
      type: typeof ADD_PARTICIPANT;
      payload: { participantId: string; stream: MediaStream };
    }
  | {
      type: typeof REMOVE_PARTICIPANT;
      payload: { participantId: string };
    };
export const ParticipantReducer = (
  state: participantState,
  action: participantAction
) => {
  switch (action.type) {
    case ADD_PARTICIPANT:
      return {
        ...state,
        [action.payload.participantId]: {
          stream: action.payload.stream,
        },
      };

    case REMOVE_PARTICIPANT:
      const { [action.payload.participantId]: deleted, ...rest } = state;
      return rest;

    default:
      return { ...state };
  }
};
