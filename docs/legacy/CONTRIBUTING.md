# Contributing

This project is a demo and intentionally lightweight. If you'd like to contribute or extend it, follow these guidelines.

Local development
- Backend: `cd backend && npm install && npm run dev` (uses nodemon for live reload)
- Frontend: `cd frontend && npm install && npm run dev` (Vite)

Coding style
- Keep changes minimal and focused. Follow existing file structure and patterns.
- Use clear prop names in React components and keep side-effects in hooks.

Commits and PRs
- Small commits with clear messages. One logical change per PR.

Environment
- The backend reads configuration from `backend/.env` or `./.env` at project root. See `backend/.env.example`.

Testing
- There are no automated tests in the demo. If you add tests, use Jest for frontend and Mocha/Chai for backend.

Contact
- Open an issue or a PR with a clear description and reproducible steps.
