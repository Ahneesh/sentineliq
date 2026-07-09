# Database Migrations

SentinelIQ uses Alembic for schema migrations.

## Fresh local database

```bash
cd ~/Documents/sentineliq
docker compose down -v
docker compose up -d
source venv/bin/activate
cd backend
alembic upgrade head
```

## Create a new migration

```bash
cd backend
alembic revision --autogenerate -m "describe change"
```

## Apply migrations

```bash
cd backend
alembic upgrade head
```

## Roll back one migration

```bash
cd backend
alembic downgrade -1
```

## Rule

Do not use `Base.metadata.create_all()` for production schema management. All persistent schema changes should go through Alembic.
