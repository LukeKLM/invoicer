# invoicer

### TODOS:
 - [ ] clean .gitignore from unnecessary files


## Working with migrations
- starts with `alembic init migrations` [//] tool - command - folder

- `alembic revision --autogenerate -m "First revision"` [//] makes changes revision
- `alembic upgrade head` [//] run migrations to the highest level
- `alembic upgrade #hash#` [//] run specific migration
- `alembic downgrade #hash#` [//] revert specific migration