import * as React from 'react';

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

export function useIsMobile(): boolean {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    mediaQuery.addEventListener('change', onStoreChange);
    return () => mediaQuery.removeEventListener('change', onStoreChange);
  }, []);

  const getSnapshot = React.useCallback(
    () => window.matchMedia(MOBILE_MEDIA_QUERY).matches,
    []
  );

  const getServerSnapshot = React.useCallback(() => false, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
