export interface WebSocketHandler {
  (socket: import('socket.io').Socket, ...args: any[]): Promise<void> | void;
}
