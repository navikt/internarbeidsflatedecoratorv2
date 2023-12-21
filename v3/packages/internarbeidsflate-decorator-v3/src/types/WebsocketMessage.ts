export type WebSocketMessageType = 'NY_AKTIV_BRUKER' | 'NY_AKTIV_ENHET';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: string;
}
