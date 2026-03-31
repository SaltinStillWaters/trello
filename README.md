# SudoCodes POS

A point-of-sale system built with NestJS for the backend and React for the frontend.

## Development Guidelines

### Conventions
- Follow ESLint and Prettier configurations for consistent code formatting
- Use camelCase for variables and functions, PascalCase for classes and components, and SCREAMING_SNAKE_CASE for constants.
- Commit messages should be a meaningful commit message preceeded by the task id.
- Branch names should be the task/ticket id (ex. POS-001).

### Git Branch Naming
- `feature/branch-name` - New features
- `bugfix/branch-name` - Bug fixes
- `hotfix/branch-name` - Urgent production fixes
- `chore/branch-name` - Maintenance tasks

## Testing with Docker Containers

## Full Clean Reset
```bash
docker-compose down -v
docker-compose build
docker-compose up
```

## Quick Testing (Preserves Data)
```bash
docker-compose up --build
```

## Simple Restart
```bash
docker-compose restart
```

**Note:** The `-v` flag removes all data. Skip it if you want to keep your database and volumes.