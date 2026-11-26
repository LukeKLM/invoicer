import Cookies from "js-cookie";
import fetchClient from "@/lib/httpClient";
import { ACCESS_TOKEN_COOKIE, getTokenExpiration } from "@/lib/auth";

export function setAccessToken(token: string) {
  Cookies.set(ACCESS_TOKEN_COOKIE, token, {
    // browser drops the cookie together with the token expiration
    expires: getTokenExpiration(token) ?? undefined,
    httpOnly: false, // Set to true only on server-side cookies
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}

export const login = async (email: string, password: string) => {
  const result = await fetchClient(
    "/auth/token",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  )
  const json_data = await result.json()

  if (!json_data.access_token) {
    return false
  }

  setAccessToken(json_data.access_token)

  return true
}
