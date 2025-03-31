import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useReduxHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const auth = useSelector((state) => state.auth);
  const navbar = useSelector((state) => state.navbar);

  useEffect(() => {
    // Check if both auth and navbar states are available
    if (auth !== undefined && navbar !== undefined) {
      setIsHydrated(true);
    }
  }, [auth, navbar]);

  return isHydrated;
}; 