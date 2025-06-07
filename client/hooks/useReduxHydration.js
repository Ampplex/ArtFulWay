import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useReduxHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const _persist = useSelector((state) => state._persist);

  useEffect(() => {
    if (_persist && _persist.rehydrated) {
      setIsHydrated(true);
    }
  }, [_persist]);

  return isHydrated;
}; 