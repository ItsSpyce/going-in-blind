import db from 'server/db';
import { v4 } from 'uuid';

export async function createUser(username: string) {
  // create an auth token
  const authToken = v4().replace(/-/g, '');
  await db.user.create({ data: { name: username, authToken } });
  return authToken;
}

export async function isUsernameTaken(username: string) {
  return !!(await db.user.findUnique({ where: { name: username } }));
}

export async function getUserByToken(authToken: string) {
  return await db.user.findUnique({ where: { authToken } });
}

export async function getUserById(id: string) {
  return await db.user.findFirst({ where: { socketId: id } });
}

export async function assignId(authToken: string, id: string) {
  try {
    await db.user.update({ where: { authToken }, data: { socketId: id } });
    return true;
  } catch (err) {
    return false;
  }
}
