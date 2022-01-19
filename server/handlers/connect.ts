import type { WebSocketHandler } from 'server/types';
import { getUserByToken } from 'server/services/user-service';
import { createWebsocketHandler } from 'server/socket-handler';

const onConnection: WebSocketHandler = async (socket) => {
  if (socket.request.headers['x-auth-token']) {
    const user = await getUserByToken(
      `${socket.request.headers['x-auth-token']}`
    );
    if (user) {
      socket.send('Logged in');
    }
  }
};

export default createWebsocketHandler('connect', onConnection);
