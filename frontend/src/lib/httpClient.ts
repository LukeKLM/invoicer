import Cookies from "js-cookie"

const get_headers = () => {
    const headers: {[key: string]: string} = {
        'Content-Type': 'application/json',
    }

    const token = Cookies.get("access_token")
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    return headers
}

const fetchClient = async(
    url: string,
    options: RequestInit={}
) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        ...options,
        headers: {
            ...get_headers(),
            ...options.headers,
        }
    });

    if (!res.ok) {
        throw new Error(`Fetch error (status: ${res.status})`);
    }

    return res;
}

export default fetchClient
