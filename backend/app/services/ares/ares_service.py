from app.helpers.http_clients.ares_http_client import AresHttpClient


class AresApiService:
    def __init__(self):
        self.client = AresHttpClient()

    async def get_economic_subject(self, company_id: str):
        return await self.client.get_economic_subject(company_id)
