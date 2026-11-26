import { getAccessToken, logoutAndRedirect } from "@/lib/auth"

const get_headers = () => {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

const fetchClient = async (
  url: string,
  options: RequestInit = {}
) => {
  const hadToken = !!getAccessToken()
  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...options,
    headers: {
      ...get_headers(),
      ...options.headers,
    }
  });

  // token expired or was revoked - log the user out
  if (res.status === 401 && hadToken) {
    logoutAndRedirect()
  }

  if (!res.ok) {
    throw new Error(`Fetch error (status: ${res.status})`);
  }

  return res;
}

export default fetchClient
