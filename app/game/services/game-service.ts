const rooms = new Map<string, GameRoom>();

export type GameRoom = {
  owner: string;
  players: string[];
};

export function canJoinRoom(username: string, roomCode: string) {
  if (!rooms.has(roomCode)) {
    return false;
  }
  const room = rooms.get(roomCode)!;
  return room.players.length < 8 && !room.players.includes(username);
}
