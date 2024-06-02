from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication import BearerTransport
from fastapi_users.authentication import JWTStrategy

from core.config import settings

bearer_transport = BearerTransport(tokenUrl="auth/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.AUTH_SECRET, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    get_strategy=get_jwt_strategy,
    name="jwt",
    transport=bearer_transport,
)
