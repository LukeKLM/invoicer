"""automatic_datetime

Revision ID: 0008
Revises: 0007
Create Date: 2025-04-08 07:47:46.263259

"""
from collections.abc import Sequence

from migrations.migrations_helper import attach_updated_at_triggers_to_all_tables

# revision identifiers, used by Alembic.
revision: str = "0008"
down_revision: str | None = "0007"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    attach_updated_at_triggers_to_all_tables()


def downgrade() -> None:
    pass
