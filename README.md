# Battron — Battery Job Card

React + TypeScript + Vite + Tailwind frontend for the Battron battery-repair job card and leads dashboard.

**Backend:** [Battron_Service_Platform_Backend](../Battron_Service_Platform_Backend) (FastAPI). The UI talks to `http://localhost:8000/api/v1` by default.

## Run (frontend + backend)

1. Start the API (from the backend repo):

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

2. Configure the frontend (`.env`):

   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. Start the UI:

   ```bash
   npm install
   npm run dev
   ```

## Auth

- **Login:** `POST /auth/login` — use seeded admin or register a technician.
- **Register:** `/register` → `POST /auth/register` (technician role).
- JWT is stored in `localStorage` (`battron_access_token`).

## Routes

| Path | Screen |
|------|--------|
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Leads list |
| `/job-card` | Job card form |
| `/job-card?jcno=…` | Open saved job |
| `/job-card?new=1` | New blank card |

## Scripts

```bash
npm run dev        # Vite dev server
npm run build      # tsc + production build
npm run typecheck
npm run preview
```

## API client

`src/lib/api/` — typed client for auth, jobs, leads, meta, and score endpoints. See backend `FRONTEND_API_INTEGRATION_PROMPT.md` for the full contract.

The original HTML reference remains at `Battron_Job_Card.html`.
