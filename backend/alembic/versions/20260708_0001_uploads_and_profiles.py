"""create uploads and dataset profiles

Revision ID: 20260708_0001
Revises:
Create Date: 2026-07-08
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "20260708_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "uploads",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("dataset_type", sa.String(length=100), nullable=False),
        sa.Column("row_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="COMPLETED"),
        sa.Column("validation_score", sa.Integer(), nullable=False, server_default="100"),
        sa.Column("storage_path", sa.String(length=500), nullable=True),
        sa.Column("uploaded_by", sa.String(length=100), nullable=False, server_default="local_user"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_uploads_created_at", "uploads", ["created_at"])

    op.create_table(
        "dataset_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("upload_id", sa.Integer(), sa.ForeignKey("uploads.id", ondelete="CASCADE"), nullable=False),
        sa.Column("row_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("column_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("duplicate_rows", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("null_percentage", sa.Float(), nullable=False, server_default="0"),
        sa.Column("profile_schema", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("statistics", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_dataset_profiles_upload_id", "dataset_profiles", ["upload_id"])


def downgrade() -> None:
    op.drop_index("ix_dataset_profiles_upload_id", table_name="dataset_profiles")
    op.drop_table("dataset_profiles")
    op.drop_index("ix_uploads_created_at", table_name="uploads")
    op.drop_table("uploads")
