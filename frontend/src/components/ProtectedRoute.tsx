import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { clearAccessToken, getAccessToken, getTokenExpiration, hasValidAccessToken, logoutAndRedirect } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = hasValidAccessToken()

  // log out the moment the token expires, even when the user just keeps the page open
  useEffect(() => {
    const token = getAccessToken()
    const expiration = token && getTokenExpiration(token)
    if (!expiration) return

    // setTimeout overflows above ~24.8 days, the route re-checks the token on navigation anyway
    const delay = Math.min(Math.max(expiration.getTime() - Date.now(), 0), 2 ** 31 - 1)
    const timeout = window.setTimeout(logoutAndRedirect, delay)
    return () => window.clearTimeout(timeout)
  }, [isAuthenticated])

  if (!isAuthenticated) {
    clearAccessToken()
    // Redirect to login while preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
