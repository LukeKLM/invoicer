from app.models.users import User
from core.db import SessionLocal


class BaseApiService:
    def __init__(self, user: User, db_session: SessionLocal):
        self.user = user
        self.db_session = db_session
        self.repository = None
