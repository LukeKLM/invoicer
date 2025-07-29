import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation()
  const accessToken = Cookies.get('access_token')

  useEffect(() => {
    console.log('Access token:', accessToken)
  }, [accessToken])

  if (!accessToken) {
    // Redirect to login while preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
