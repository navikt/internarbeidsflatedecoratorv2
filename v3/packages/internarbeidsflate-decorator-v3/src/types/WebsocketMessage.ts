export type WebSocketMessageType = 'NY_AKTIV_BRUKER' | 'NY_AKTIV_ENHET';

export interface WebSocketMessage {
  eventType: WebSocketMessageType;
  verdi: string;
}
