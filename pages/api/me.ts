import { getUserByToken } from 'server/services/user-service';
import {
  clearAuthToken,
  ok,
  respondWithError,
} from 'server/utils/request-helpers';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authToken = req.headers['x-auth-token'];
  if (!authToken || Array.isArray(authToken)) {
    console.error('Request supplied invalid auth token');
    return respondWithError(clearAuthToken(res), 'Invalid auth token');
  }
  const user = await getUserByToken(authToken);
  if (!user) {
    console.error('No user with matching auth token found');
    return respondWithError(clearAuthToken(res), 'Invalid auth token');
  }

  return ok(res, { username: user.name, id: user.socketId });
}
