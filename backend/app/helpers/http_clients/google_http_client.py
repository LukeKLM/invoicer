import json

import httpx
from google.auth import jwt

from app.helpers.http_clients.base_http_client import BaseHttpClient
from app.schemas.auth import GoogleIdTokenDetail
from app.schemas.auth import GoogleToken
from core.config import settings


class GoogleHttpClient(BaseHttpClient):
    OAUTH_URL = "https://oauth2.googleapis.com"

    def __init__(self):
        self.client_id = settings.GOOGLE_CLIENT_ID
        self.client_secret = settings.GOOGLE_CLIENT_SECRET
        self.redirect_uri = "http://localhost:8000/auth/google/callback"

    async def change_code_for_token(self, code) -> GoogleIdTokenDetail | None:
        data = {
            "code": code,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": self.redirect_uri,
            "grant_type": "authorization_code",
        }

        response = await self.post(
            url=self.OAUTH_URL + "/token",  #  https://oauth2.googleapis.com/token
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        if not response or response.status_code != httpx.codes.OK:
            return None

        google_token = GoogleToken(
            **json.loads(response.text),
        )

        payload = jwt.decode(google_token.id_token, verify=False)

        return GoogleIdTokenDetail(**payload)
