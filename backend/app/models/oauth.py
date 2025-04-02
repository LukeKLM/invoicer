import uuid

from sqlalchemy import UUID
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.enums.oauth_enums import OAuthEnum
from core.db import BaseModel
from core.db_utils import str_10
from core.db_utils import str_255


class OAuthAccount(BaseModel):
    __tablename__ = "oauth_accounts"

    id: Mapped[int] = mapped_column(primary_key=True)
    identifier: Mapped[str_255]
    oauth_type: Mapped[str_10 | None] = mapped_column(SQLAlchemyEnum(OAuthEnum))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID)

    user = relationship("User", back_populates="oauth_accounts")
