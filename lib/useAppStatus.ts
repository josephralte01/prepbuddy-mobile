import { useState } from 'react';

export function useAppStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const raiseError = (message: string) => {
    setError(message);
    console.error('App Error:', message);
  };

  return { loading, error, startLoading, stopLoading, raiseError };
}
