import db from 'server/db';

export async function createRoom() {}

export async function findGame(roomCode: string) {
  return await db.game.findUnique({ where: { id: roomCode } });
}
