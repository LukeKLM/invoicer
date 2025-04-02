from datetime import datetime
from typing import Annotated

from sqlalchemy import String
from sqlalchemy.orm import mapped_column
from sqlalchemy.sql import func

str_255 = Annotated[str, mapped_column(String(255))]
str_10 = Annotated[str, mapped_column(String(10))]
default_now = Annotated[datetime, mapped_column(server_default=func.now())]
update_now = Annotated[
    datetime,
    mapped_column(server_default=func.now(), server_onupdate=func.now()),
]
