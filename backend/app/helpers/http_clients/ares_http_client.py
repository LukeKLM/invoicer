import json

from app.helpers.http_clients.base_http_client import BaseHttpClient
from app.services.ares.ares_schema import AresEconomicSubject


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

        model_data = {
            "ico": response_data.get("ico"),
            "dic": response_data.get("dic"),
            "name": response_data.get("obchodniJmeno"),
            "residence": {
                "state": response_data.get("sidlo", {}).get("nazevStatu"),
                "city": response_data.get("sidlo", {}).get("nazevObce"),
                "city_part": response_data.get("sidlo", {}).get("nazevCastiObce"),
                "street": response_data.get("sidlo", {}).get("nazevUlice"),
                "zip_code": response_data.get("sidlo", {}).get("psc"),
                "house_number": response_data.get("sidlo", {}).get("cisloDomovni"),
                "reference_number": response_data.get("sidlo", {}).get(
                    "cisloOrientacni",
                ),
                "full_address": response_data.get("sidlo", {}).get("textovaAdresa"),
            },
        }

        return AresEconomicSubject(**model_data) if model_data else None
