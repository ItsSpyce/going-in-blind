import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, isUsernameTaken } from 'server/services/user-service';
import { notFound, ok, respondWithError } from 'server/utils/request-helpers';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return notFound(res);
    }
    if (req.headers['x-auth-token']) {
      return respondWithError(res, 'User is already logged in');
    }
    const username = req.body?.username;
    if (!username) {
      return respondWithError(res, 'Username required');
    }
    if (await isUsernameTaken(username)) {
      return respondWithError(res, 'Username taken');
    }
    const authToken = await createUser(username);
    return ok(res, {
      authToken,
    });
  } catch (err) {
    return respondWithError(res, err as Error);
  }
}
