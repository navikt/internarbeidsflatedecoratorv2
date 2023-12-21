export interface WebSocketListener {
  onMessage?(event: MessageEvent): void;
  onOpen?(event: Event): void;
  onError?(event: Event): void;
  onClose?(event: CloseEvent): void;
}
