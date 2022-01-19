import type { WebSocketHandler } from 'server/types';
import { getUserByToken } from 'server/services/user-service';
import { findGame } from 'server/services/game-service';
import WebSocketErrors from 'app/core/enums/web-socket-errors';
import GameErrors from 'app/core/enums/game-errors';
import { createWebsocketHandler } from 'server/socket-handler';

const onJoin: WebSocketHandler = async (socket, roomCode: string) => {
  if (!socket.request.headers['x-auth-token']) {
    socket.emit('auth', 'User not logged in');
    return;
  }
  const user = await getUserByToken(
    `${socket.request.headers['x-auth-token']}`
  );
  if (!user) {
    socket.emit('auth', WebSocketErrors.SESSION_NOT_FOUND);
    return;
  }
  const game = await findGame(roomCode);
  if (!game) {
    socket.emit('game/join', GameErrors.GAME_NOT_FOUND);
  } else if (
    game.memberNames.includes(user.name) ||
    game.memberNames.length < 8
  ) {
    await socket.join(game.id);
    socket.emit('game/join', game, (data: any) => {
      console.log(data);
    });
  }
};

export default createWebsocketHandler('game/join', onJoin);
