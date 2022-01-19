import { useEffect } from 'react';
import { useCurrentUser, useLoading } from 'app/auth/hooks';

export default function Home() {
  const { currentUser, isFetching } = useCurrentUser({ allowAnonymous: true });
  const [_, setIsLoading] = useLoading(true);
  useEffect(() => {
    if (!isFetching) {
      setIsLoading(false);
    }
  }, [isFetching]);
  return (
    <>
      {!isFetching && (
        <>
          {currentUser && <h1>Hello, {currentUser.username}</h1>}
          {!currentUser && <h2>You are not logged in</h2>}
        </>
      )}
    </>
  );
}
