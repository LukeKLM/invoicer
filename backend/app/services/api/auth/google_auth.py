from app.enums.oauth_enums import OAuthEnum
from app.exceptions.api_exceptions import NotFoundException
from app.helpers.http_clients.google_http_client import GoogleHttpClient
from app.repositories.oauth import OAuthRepository
from app.schemas.auth import GoogleIdTokenDetail
from app.schemas.auth import OAuthAccountDetail
from app.services.api.auth import AuthApiService
from app.services.api.base_api_service import BaseApiService
from core.db import SessionLocal


class GoogleAuthenticatorService(BaseApiService):
    def __init__(self, db_session: SessionLocal):
        super().__init__(db_session)
        self.repository = OAuthRepository(db_session)
        self.output_schema = OAuthAccountDetail

    async def identify_user(self, code):
        token_detail: GoogleIdTokenDetail = (
            await GoogleHttpClient().change_code_for_token(code)
        )
        return token_detail

    async def get_or_create_user(self, token_detail: GoogleIdTokenDetail):
        user_service = AuthApiService(self.db_session)

        oauth_account = await self.repository.get_by_identifier(
            identifier=token_detail.sub,
            oauth_type=OAuthEnum.GOOGLE,
        )

        if oauth_account:
            return oauth_account.user

        try:
            user = await user_service.get_by_email(email=token_detail.email)
        except NotFoundException:
            # when user not found, we create a new user
            user = None

        if not user:
            user = await user_service.create_user_no_password(
                email=token_detail.email,
            )
            self.db_session.flush(user)

        await self.repository.create(
            data={
                "user_id": user.id,
                "identifier": token_detail.sub,
                "oauth_type": OAuthEnum.GOOGLE,
            },
        )

        await self.db_session.commit()

        return user
