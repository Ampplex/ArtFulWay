import React from 'react';
import { useReduxHydration } from '../hooks/useReduxHydration';

const ReduxHydrationWrapper = ({ children }) => {
  const isHydrated = useReduxHydration();

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return children;
};

export default ReduxHydrationWrapper; 