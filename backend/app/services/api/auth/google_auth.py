from app.enums.oauth_enums import OAuthEnum
from app.helpers.http_clients.google_http_client import GoogleHttpClient
from app.repositories.oauth import OAuthRepository
from app.repositories.users import UserRepository
from app.schemas.auth import GoogleIdTokenDetail
from app.schemas.auth import OAuthAccountDetail
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
        if not token_detail:
            # todo: raise exception
            return

    async def get_or_create_user(self, token_detail: GoogleIdTokenDetail):
        user_repository = UserRepository(self.db_session)

        oauth_account = await self.repository.get_by_identifier(
            identifier=token_detail.sub,
            oauth_type=OAuthEnum.GOOGLE,
        )

        if oauth_account:
            return oauth_account.user

        user = user_repository.get_by_email(email=token_detail.email)
        if not user:
            user = await UserRepository.create(
                {
                    "email": token_detail.email,
                    "hashed_password": None,
                },
            )

        await self.repository.create(
            data={
                "user_id": user.id,
                "identifier": token_detail.sub,
                "oauth_type": OAuthEnum.GOOGLE,
            },
        )

        return user
