/**
 * API client with global error handling
 * Automatically logs out users when receiving 401 Unauthorized responses
 */

interface FetchOptions extends RequestInit {
  skipAuthRedirect?: boolean
}

export async function apiClient(
  url: string, 
  options: FetchOptions = {}
): Promise<Response> {
  const { skipAuthRedirect, ...fetchOptions } = options
  
  const response = await fetch(url, fetchOptions)
  
  // Handle unauthorized responses
  if (response.status === 401 && !skipAuthRedirect) {
    // Clear session and redirect to login
    document.cookie = 'auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    
    // Show error message
    if (typeof window !== 'undefined') {
      const message = 'Your session has expired. Please login again.'
      
      // Use toast if available
      if (window.localStorage) {
        window.localStorage.setItem('auth_error', message)
      }
      
      // Redirect to login
      window.location.href = '/login'
    }
    
    throw new Error('Unauthorized')
  }
  
  return response
}

/**
 * Wrapper for fetch with automatic auth handling
 */
export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiClient(url, options)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `Request failed with status ${response.status}`)
  }
  
  return response.json()
}
