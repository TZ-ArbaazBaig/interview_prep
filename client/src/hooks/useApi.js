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

      const apiEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}${apiEndpoint}`, config);
      
      // 1. Check if the response is empty (e.g., 204 No Content)
      if (response.status === 204) {
        return null;
      }

      // 2. Safely parse JSON or return text/error
      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          result = await response.json();
        } catch (jsonErr) {
          console.error('JSON Parse Error:', jsonErr);
          throw new Error('Server returned invalid JSON format.');
        }
      } else {
        // Handle non-JSON responses (e.g., HTML error pages from proxy)
        const text = await response.text();
        console.warn('Non-JSON response received:', text.substring(0, 100));
        
        if (!response.ok) {
          throw new Error(`Server Error (${response.status}): ${text.substring(0, 50)}...`);
        }
        return text;
      }

      if (!response.ok) {
        throw new Error(result.error || result.message || `Request failed with status ${response.status}`);
      }

      return result;
    } catch (err) {
      console.error(`API ${method} ${endpoint} error:`, err.message);
      // If it's the specific "Unexpected end of JSON input" error from fetch
      if (err.message.includes('Unexpected end of JSON input')) {
        throw new Error('Server returned an empty or malformed response. Please check if the backend is running.');
      }
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
