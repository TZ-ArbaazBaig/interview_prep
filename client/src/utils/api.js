import { useAuth } from '@clerk/clerk-react'

// Replace your existing api utility with this:
export function useApi() {
  const { getToken } = useAuth()

  const request = async (method, endpoint, data = null) => {
    const token = await getToken()
    
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    // Ensure endpoint starts with /api if it doesn't already
    const apiEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${baseUrl}${apiEndpoint}`, config)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong')
    }

    return result
  }

  return {
    get: (endpoint) => request('GET', endpoint),
    post: (endpoint, data) => request('POST', endpoint, data),
    delete: (endpoint) => request('DELETE', endpoint)
  }
}
