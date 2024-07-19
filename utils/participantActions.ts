export const ADD_PARTICIPANT = "ADD_PARTICIPANT" as const;
export const REMOVE_PARTICIPANT = "REMOVE_PARTICIPANT" as const;

export const addParticipantAction = (
  participantId: string,
  stream: MediaStream
) => ({
  type: ADD_PARTICIPANT,
  payload: { participantId, stream },
});

export const removeParticipantAction = (participantId: string) => ({
  type: REMOVE_PARTICIPANT,
  payload: { participantId },
});
