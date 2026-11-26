"""Skip Pay calculator settings

Revision ID: 0010
Revises: 0009
Create Date: 2026-11-25 12:00:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

from migrations.migrations_helper import attach_updated_at_triggers_to_all_tables

# revision identifiers, used by Alembic.
revision: str = "0010"
down_revision: str | None = "0009"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "skip_pay_calculator_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("daily_rate", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("kd_bonus", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("repayment", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("special_bonus", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("learning_budget", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("multisport_card", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("development_percentage", sa.Integer(), nullable=False),
        sa.Column("maintenance_percentage", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"]),
        sa.ForeignKeyConstraint(
            ["customer_id"],
            ["invoice_customers.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("customer_id"),
    )
    op.create_index(
        op.f("ix_skip_pay_calculator_settings_id"),
        "skip_pay_calculator_settings",
        ["id"],
        unique=False,
    )

    attach_updated_at_triggers_to_all_tables()


def downgrade() -> None:
    op.drop_index(
        op.f("ix_skip_pay_calculator_settings_id"),
        table_name="skip_pay_calculator_settings",
    )
    op.drop_table("skip_pay_calculator_settings")
