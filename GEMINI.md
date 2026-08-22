# Freelance Project Management System

## Project Overview

This project is a freelance project management system designed to help manage client projects, assignments, deadlines, payments, and related project information in one place.

## Technology Stack

- Frontend: React
- Backend: Node.js
- Database: MongoDB
- Architecture: MERN-style full-stack application

## Development Principles

- Keep the code modular, readable, and maintainable.
- Follow a clear separation between frontend, backend, and database logic.
- Prefer simple solutions over unnecessary complexity.
- Reuse existing components, utilities, and functions where appropriate.
- Do not introduce new dependencies unless they are genuinely necessary.
- Preserve existing functionality when modifying the application.

## React Conventions

- Use functional components.
- Keep components focused on a single responsibility.
- Create reusable components for UI elements used in multiple places.
- Use meaningful component, variable, and function names.
- Avoid unnecessarily large components.
- Keep business logic separate from presentation logic where practical.

## Node.js Conventions

- Organize API routes by feature or resource.
- Keep routing, business logic, and database operations separated where practical.
- Validate incoming data before processing it.
- Handle errors consistently.
- Keep sensitive configuration in environment variables.

## MongoDB Conventions

- Use clear and descriptive collection and field names.
- Validate data before storing it.
- Avoid unnecessary duplication of data.
- Keep database operations separate from frontend code.
- Never hard-code database credentials or connection strings.

## Security

- Never commit passwords, API keys, database credentials, tokens, or other secrets.
- Use environment variables for sensitive configuration.
- Never expose private credentials to the React frontend.
- Validate and sanitize user-controlled input.

## Git Conventions

Use Conventional Commits.

Examples:

- `feat: add project creation`
- `fix: correct payment calculation`
- `docs: improve README`
- `refactor: simplify project service`
- `chore: update project configuration`

Keep commits focused on one logical change.

## AI Development Guidelines

Before making changes:

1. Inspect the existing project structure.
2. Understand how the relevant code currently works.
3. Reuse existing patterns where possible.
4. Explain the proposed approach before making significant changes.

When making changes:

- Modify only what is necessary.
- Do not rewrite unrelated code.
- Do not introduce unnecessary dependencies.
- Preserve existing functionality.
- Review the resulting changes before considering the task complete.
- Run appropriate tests or checks when available.