import uuid

from app.exceptions.api_exceptions import AuthenticationFailedException
from app.exceptions.api_exceptions import NotFoundException
from app.repositories.auth import AuthRepository
from app.schemas.auth import UserRegister
from app.schemas.users import UserDetail
from app.services.api.base_api_service import BaseApiService
from core.db import SessionLocal
from core.security import get_password_hash
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

    async def create_user(self, email: str, password1: str, password2: str):
        user = UserRegister(
            email=email,
            password1=password1,
            password2=password2,
        )

        user = await self.repository.create(
            {
                "id": uuid.uuid4(),
                "email": user.email,
                "hashed_password": get_password_hash(password1),
            },
            commit=True,
        )
        return self.output_schema(**user.__dict__)
