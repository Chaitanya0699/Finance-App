import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady(): void {
  useEffect(() => {
    // Avoids error on Android where "window" doesn't exist
    if (typeof window !== 'undefined' && typeof window.frameworkReady === 'function') {
      window.frameworkReady();
    }
  }, []);
}
