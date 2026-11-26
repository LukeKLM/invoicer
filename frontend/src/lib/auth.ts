import Cookies from "js-cookie"

export const ACCESS_TOKEN_COOKIE = "access_token"

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_COOKIE)

// Reads the `exp` claim (seconds since epoch) from the JWT payload, without verifying it
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const payload = token.split(".")[1]
    const json = JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return typeof json.exp === "number" ? new Date(json.exp * 1000) : null
  } catch {
    return null
  }
}

// The backend puts the user's email into the `sub` claim
export const getTokenSubject = (token: string): string | null => {
  try {
    const payload = token.split(".")[1]
    const json = JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return typeof json.sub === "string" ? json.sub : null
  } catch {
    return null
  }
}

export const isTokenExpired = (token: string) => {
  const expiration = getTokenExpiration(token)
  // a token we can't read is treated as invalid
  return !expiration || expiration.getTime() <= Date.now()
}

export const hasValidAccessToken = () => {
  const token = getAccessToken()
  return !!token && !isTokenExpired(token)
}

export const clearAccessToken = () => Cookies.remove(ACCESS_TOKEN_COOKIE)

// Used outside of React (http client) - hard redirect also resets all zustand stores
export const logoutAndRedirect = () => {
  clearAccessToken()
  if (window.location.pathname !== "/login") {
    window.location.assign("/login")
  }
}
