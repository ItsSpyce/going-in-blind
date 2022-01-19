import { NextApiResponse } from 'next';

export function clearAuthToken(res: NextApiResponse) {
  res.removeHeader('x-auth-token');
  return res;
}

export function respondWithError(res: NextApiResponse, error: string | Error) {
  return res
    .status(500)
    .send({ error: typeof error === 'string' ? error : error.message });
}

export function ok(res: NextApiResponse, body?: any) {
  return res.status(200).send(body || { status: 'ok' });
}

export function notFound(res: NextApiResponse) {
  return res.status(404).send({ error: 'Not found' });
}
