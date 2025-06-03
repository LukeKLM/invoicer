import json

from app.helpers.http_clients.base_http_client import BaseHttpClient
from app.services.mappers import ares_economic_subject_mapper


class AresHttpClient(BaseHttpClient):
    BASE_URL = "https://ares.gov.cz"
    ECONOMIC_SUBJECTS_URL = "/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty"

    def _get_headers(self):
        return {"Accept": "application/json"}

    async def get_economic_subject(self, company_id: str):
        url = f"{self.BASE_URL}{self.ECONOMIC_SUBJECTS_URL}/{company_id}"

        result = await self.get(url, headers=self._get_headers())

        if not result:
            return None

        response_data = json.loads(result.text)

        return ares_economic_subject_mapper(response_data)
