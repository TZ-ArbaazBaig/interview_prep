import { useAuth } from '@clerk/clerk-react'

// Hook to handle API requests with Clerk authentication
export function useApi() {
  const { getToken } = useAuth()

  const request = async (method, endpoint, data = null) => {
    try {
      const token = await getToken()
      
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }

      if (data) {
        config.body = JSON.stringify(data);
      }

      // Ensure endpoint starts with /api if it doesn't already
      const apiEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
      
      // Vite proxy handles the base URL in dev, but for production/Clerk 
      // it's better to be explicit if configured. 
      // However, we'll use the relative path if VITE_API_URL is not set.
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}${apiEndpoint}`, config);
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Something went wrong');
      }

      return result;
    } catch (err) {
      console.error(`API ${method} ${endpoint} error:`, err.message);
      throw err;
    }
  }

  return {
    request, // keep compatibility with existing code
    get: (endpoint) => request('GET', endpoint),
    post: (endpoint, data) => request('POST', endpoint, data),
    delete: (endpoint) => request('DELETE', endpoint)
  }
}
