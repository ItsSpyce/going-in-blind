import { Socket } from 'socket.io';
import { WebSocketHandler } from './types';

const websocketHandlers = new Map<string, WebSocketHandler>();

export function createWebsocketHandler(
  path: string,
  handler: WebSocketHandler
) {
  websocketHandlers.set(path, handler);
}

export function bind(socket: Socket) {
  for (const [path, handler] of websocketHandlers) {
    socket.on(path, (...args) => handler(socket, ...args));
  }
}

export function emit(socket: Socket, path: string) {
  if (websocketHandlers.has(path)) {
    websocketHandlers.get(path)!(socket);
  }
}

export const socketHandlerMiddlware =
  () => (socket: Socket, next: (err?: Error) => void) => {
    try {
      bind(socket);
      emit(socket, 'connect');
      next();
    } catch (err) {
      next(err as Error);
    }
  };
