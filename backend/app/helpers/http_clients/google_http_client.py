import json
import jwt
from app.helpers.http_clients.base_http_client import BaseHttpClient
from app.schemas.auth import GoogleToken


class GoogleHttpClient(BaseHttpClient):
    OAUTH_URL = "https://oauth2.googleapis.com"
    TOKEN_URL = "/token"

    def __init__(self):
        self.client_id = "405850242170-ajtu9jonom8i887qik0evep31e6jg3uk.apps.googleusercontent.com"
        self.client_secret = "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"
        self.redirect_uri = "http://localhost:8000/auth/google/callback"

    async def change_code_for_token(self, code):
        data = {
            "code": code,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": self.redirect_uri,
            "grant_type": "authorization_code"
        }

        response = await self.post(
            url=self.OAUTH_URL + self.TOKEN_URL,  #  https://oauth2.googleapis.com/token
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        if not response or not response.ok:
            return None

        google_token = GoogleToken(
            **json.loads(response.text)
        )

        payload = jwt.decode(
            google_token.access_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        return response