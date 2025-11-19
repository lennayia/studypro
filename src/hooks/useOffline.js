import { useState, useEffect } from 'react';

/**
 * useOffline hook - Detects online/offline status
 *
 * @returns {Object} { isOffline, isOnline }
 *
 * @example
 * const { isOffline, isOnline } = useOffline();
 *
 * if (isOffline) {
 *   return <OfflineMessage />;
 * }
 */
export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? window.navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🟢 Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.warn('🔴 Connection lost - app is now offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOnline(window.navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
  };
};
