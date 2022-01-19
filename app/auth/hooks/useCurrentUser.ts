import { Axios } from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState, atom } from 'recoil';
import { CurrentUser } from 'app/core/types';

const currentUserState = atom<CurrentUser | null>({
  key: 'currentUser',
  default: null,
});

type UseCurrentUserOptions = {
  // for audience
  allowAnonymous?: boolean;
};

const AUTH_TOKEN_KEY = 'auth-token';

const createApiError = (status: number, statusText: string) =>
  new Error(`Endpoint returned status code ${status} (${statusText})`);

export default function useCurrentUser(options?: UseCurrentUserOptions) {
  const axios = new Axios({
    headers: {
      'x-auth-token':
        (globalThis.localStorage && localStorage.getItem(AUTH_TOKEN_KEY)) || '',
    },
    // we'll handle the status validation ourselves
    validateStatus: () => true,
    transformResponse: (res) => JSON.parse(res),
  });

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    if (currentUser) {
      setIsFetching(false);
      return;
    }
    // try to login with the current stored auth token
    const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (authToken) {
      fetchCurrentUser()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((err) => {
          if (!options?.allowAnonymous) {
            console.error(err);
            localStorage.removeItem(AUTH_TOKEN_KEY);
          }
        });
    }
  }, [currentUser]);

  async function fetchCurrentUser() {
    try {
      const { data, status, statusText } = await axios.get('/api/me');
      if (data.error) {
        throw new Error(data.error);
      }
      if (status >= 400) {
        throw createApiError(status, statusText);
      }
      return data as CurrentUser;
    } catch (err) {
      console.error(err);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      throw new Error('Failed to fetch current user');
    } finally {
      setIsFetching(false);
    }
  }

  async function login(username: string) {
    const { data, status, statusText } = await axios.post(
      '/api/login',
      { username },
      { validateStatus: () => true }
    );
    if (data.error) {
      throw new Error(data.error);
    }
    if (status >= 400) {
      throw createApiError(status, statusText);
    }
    const { authToken } = data;
    localStorage.setItem(AUTH_TOKEN_KEY, authToken);
  }

  async function changeName(username: string) {
    const { data, status, statusText } = await axios.put('/api/me', {
      username,
    });
    if (data.error) {
      throw new Error(data.error);
    }
    if (status >= 400) {
      throw createApiError(status, statusText);
    }
    // I guess just return true?
    setCurrentUser({ ...currentUser, username });
    return true;
  }

  async function logout() {
    try {
      const { data, status, statusText } = await axios.delete('/api/me');
      if (data.error) {
        throw new Error(data.error);
      }
      if (status >= 400) {
        throw createApiError(status, statusText);
      }
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setCurrentUser(null);
    }
  }

  const returnValue = { login, logout, changeName, isFetching, currentUser };
  Object.defineProperty(returnValue, 'currentUser', {
    get: () => currentUser,
  });

  return returnValue;
}
