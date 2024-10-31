#Invoicer backend

## Running the backend
- `fastapi dev main.py --reload` [//] run the backend for development (auto-reload)

## Run Commands
Run from `backend` folder
``` python -m commands.create_user ```

## Working with migrations
- starts with `alembic init migrations` [//] tool - command - folder

- `alembic revision --autogenerate -m "First revision" --rev-id 0001` [//] makes changes revision
- `alembic upgrade head` [//] run migrations to the highest level
- `alembic upgrade #hash#` [//] run specific migration
- `alembic downgrade #hash#` [//] revert specific migration

## Pre-commit
- `pre-commit install` [//] install pre-commit hooks

# Tools used for this project
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- Pre-commit
- Docker
- Docker-compose
- PostgreSQL
- Uvicorn
- Ruff
- Black
- Pytest

# Invoicer Frontend

## Build css from scss file
- `sass --watch invoice.scss invoice.css --style compressed` [//] build compressed css from scss file
