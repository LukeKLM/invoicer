from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID

from core.db import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    pass
