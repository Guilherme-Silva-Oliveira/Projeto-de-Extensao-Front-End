# Repository Guide

- This is a single Vite + React application; there are no workspace or package boundaries.
- The runtime starts at `src/main.jsx`, renders `App.jsx`, and gets its routes from `src/routes.jsx`.
- Page components live in `src/pages/`; reusable UI components and their colocated styles live in `src/components/`; shared API setup is in `src/provider/api.js`.
- API requests use `VITE_API_BASE_URL`; if it is unset, the client targets `http://localhost:8081`. Axios requests use `withCredentials: true`, so the backend must allow credentialed requests.
- Install the locked dependency tree with `npm ci` rather than `npm install` when reproducing the project environment.
- Use `npm run dev` for local development, `npm run build` for the production bundle, `npm run preview` to serve the built bundle, and `npm run lint` for ESLint.
- There is no test, typecheck, or codegen script configured; after changes, run `npm run lint` and `npm run build` as the available automated checks.
- `dist/` is generated and ignored by Git; the Dockerfile builds it with Node 26.3.1 Alpine and serves it through Nginx on port 80.
