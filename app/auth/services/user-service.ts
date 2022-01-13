import { v4 } from 'uuid';

const users = new Array<User>();

export type User = {
  /**
   * The unique name the user has chosen
   */
  name: string;
  /**
   * The socket ID. This may change when the user is disconnected and reconnected
   */
  id?: string;
  /**
   * The user's auth token. This should never change unless the user has explicitly called
   * logout
   */
  authToken: string;
};

export function createUser(username: string) {
  // create an auth token
  const authToken = v4().replace('-', '');
  const user = {
    name: username,
    authToken,
  };
  users.push(user);
  return user;
}

export function isUsernameTaken(username: string) {
  return !users.some(
    (user) => user.name.toLowerCase() === username.toLowerCase()
  );
}

export function getUserByToken(authToken: string) {
  return users.find((user) => user.authToken === authToken);
}

export function getUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function assignId(authToken: string, id: string) {
  const matched = users.find((user) => user.authToken === authToken);
  if (matched) {
    matched.id = id;
    return true;
  }
  return false;
}
