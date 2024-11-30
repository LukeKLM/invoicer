from app.exceptions.api_exceptions import AuthenticationFailedException
from app.exceptions.api_exceptions import NotFoundException
from app.repositories.auth import AuthRepository
from app.schemas.users import UserDetail
from app.services.api.base_api_service import BaseApiService
from core.db import SessionLocal
from core.security import verify_password


class AuthApiService(BaseApiService):
    def __init__(self, db_session: SessionLocal):
        super().__init__(db_session)
        self.repository = AuthRepository(db_session)
        self.output_schema = UserDetail

    async def get_by_email(self, email: str) -> UserDetail:
        user = await self.repository.get_by_email(email)

        if not user:
            raise NotFoundException

        return self.output_schema(**user.__dict__)

    async def authenticate_user(self, email: str, password: str):
        user: UserDetail = await self.get_by_email(email)

        if not verify_password(password, user.hashed_password):
            raise AuthenticationFailedException

        return user
