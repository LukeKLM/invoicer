from datetime import datetime
from typing import Annotated

from sqlalchemy import DateTime
from sqlalchemy import String
from sqlalchemy import text
from sqlalchemy.orm import mapped_column

str_255 = Annotated[str, mapped_column(String(255))]
str_10 = Annotated[str, mapped_column(String(10))]
default_now = Annotated[
    datetime,
    mapped_column(
        DateTime(timezone=True),
        server_default=text("now()"),
        nullable=False,
    ),
]
