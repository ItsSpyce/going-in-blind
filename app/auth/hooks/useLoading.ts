import { useRecoilState, atom } from 'recoil';
import { useEffect, useState } from 'react';

const loadingCallCountState = atom({
  key: 'loadingCallCount',
  default: 0,
});

interface SetIsLoading {
  (value: boolean): void;
}

export default function useLoading(
  initialValue?: boolean
): [boolean, SetIsLoading] {
  const [loadingCounters, setLoadingCallCounters] = useRecoilState(
    loadingCallCountState
  );
  const [loading, setLoading] = useState(loadingCounters > 0);
  useEffect(() => {
    setLoading(loadingCounters > 0);
  }, [loadingCounters]);
  useEffect(() => {
    if (initialValue) {
      setLoadingCallCounters(loadingCounters + 1);
    }
  }, [initialValue]);

  const setIsLoading: SetIsLoading = (value: boolean) => {
    if (value) {
      setLoadingCallCounters(loadingCounters + 1);
    } else {
      setLoadingCallCounters(loadingCounters - 1);
    }
  };

  return [loading, setIsLoading];
}
