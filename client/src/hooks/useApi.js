import { useState, useCallback } from 'react';
import api from '../utils/api';

/**
 * Custom hook for handling API calls with loading and error states
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'An unexpected error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error, setError };
};

export default useApi;
