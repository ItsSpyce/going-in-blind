import type { WebSocketHandler } from 'server/types';

const onJoin: WebSocketHandler = async (socket, roomCode: string) => {
  if (socket.request.headers.authorization !== 'debug') {
    socket.send('Failed to join, user not logged in');
  }
  console.log(socket.id, roomCode);
};

export default onJoin;
