import httpx


class BaseHttpClient:
    async def post(self, url, data, headers: dict | None = None):
        async with httpx.AsyncClient(headers=headers) as client:
            try:
                return await client.post(url, data=data)
            except Exception as e:
                print(f"Http call failed: {e}")  # Log exception here
                return None

    async def get(self, url: str, headers: dict | None = None):
        async with httpx.AsyncClient(headers=headers) as client:
            try:
                return await client.get(url)
            except Exception as e:
                print(f"Http call failed: {e}")
                return None
