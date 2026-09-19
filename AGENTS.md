# AGENTS.md - Projeto-de-Extensao-Front-End

## Project Overview
React 19 + Vite 8 single-page application for warehouse/stock management (almoxarifado). Uses React Router v7 for routing, axios for API calls.

## Key Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build (outputs to `dist/`)
- `npm run lint` - Run ESLint (flat config)
- `npm run preview` - Preview production build locally

## Architecture
- **Entry**: `src/main.jsx` → `src/App.jsx` → `src/routes.jsx`
- **Routing**: `src/routes.jsx` defines all routes using `createBrowserRouter`
- **Pages**: `src/pages/` - each page has `.jsx` + `.css` (co-located)
- **Components**: `src/components/` - reusable UI components (Button, Card, Modal, NavBar, etc.)
- **API**: `src/provider/api.js` - axios instance with `baseURL` from `VITE_API_BASE_URL` (default: `http://localhost:8081`), `withCredentials: true`

## Environment
- `.env` defines `VITE_API_BASE_URL=http://localhost:8081`
- Vite loads env vars via `import.meta.env`

## Docker
- Multi-stage build: Node 26.3.1-alpine for build → nginx:stable-alpine for serving
- Build runs `npm ci` then `npm run build`
- Serves `dist/` via nginx on port 80

## Code Style
- ESLint flat config (`eslint.config.js`) with:
  - `@eslint/js` recommended
  - `eslint-plugin-react-hooks` recommended
  - `eslint-plugin-react-refresh` for Vite
- No Prettier config found
- JSX files use `.jsx` extension

## Important Notes
- No test framework configured
- No TypeScript (uses JS + JSDoc types via `@types/react`)
- `router` package (v2.2.0) listed but unused (React Router v7 is used)
- Backend runs separately on port 8081 (Spring Boot per README)