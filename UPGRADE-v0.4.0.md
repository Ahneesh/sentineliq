# Upgrade to SentinelIQ v0.4.0

1. Apply the overlay files to the repository.
2. Start Docker Desktop and PostgreSQL.
3. Activate the Python virtual environment.
4. Install backend dependencies.
5. Run `alembic upgrade head` from `backend/`.
6. Start FastAPI.
7. Install frontend dependencies and start Vite.
8. Open `/surveillance/scenarios`.

No existing upload or dataset-profile data is removed by this migration.
