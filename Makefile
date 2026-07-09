.PHONY: backend frontend db-up db-down migrate test lint format

db-up:
	docker compose up -d

db-down:
	docker compose down -v

backend:
	cd backend && uvicorn app.main:app --reload

frontend:
	cd frontend && npm run dev

migrate:
	cd backend && alembic upgrade head

test:
	pytest

lint:
	ruff check backend

format:
	black backend
	ruff check backend --fix
