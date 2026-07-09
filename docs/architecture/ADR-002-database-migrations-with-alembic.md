# ADR-002: Use Alembic for Database Migrations

## Status

Accepted

## Context

Early SentinelIQ prototypes used SQLAlchemy `Base.metadata.create_all()` to create tables. This caused schema drift when models evolved between feature packs. For example, the application expected `uploads.file_name`, but the database had an older table shape.

## Decision

Use Alembic as the database migration framework for all schema changes.

## Consequences

- Every schema change must be versioned.
- Developers must run `alembic upgrade head` after pulling schema changes.
- Production upgrades become repeatable and auditable.
- Database state becomes explainable for enterprise review.
