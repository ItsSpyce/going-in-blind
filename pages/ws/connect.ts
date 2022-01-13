import type { WebSocketHandler } from 'server/types';

const onConnection: WebSocketHandler = async (socket) => {
  if (!('on' in socket)) {
    // this means an external service tried to handle it
  }
};

export default onConnection;
