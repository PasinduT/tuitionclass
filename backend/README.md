# Pahas backend

The backend combines a FastAPI service with Supabase. Supabase owns Postgres, row-level security, Storage, and Auth; FastAPI owns the authenticated Gemini paper-extraction and answer-grading workflows.

## Local setup

1. Start Docker Desktop.
2. Run `pnpm install` and `pnpm supabase:start` from `backend/`.
3. The checked-in migration is applied automatically and the local dashboard opens at `http://127.0.0.1:54323`.
4. Create a Python environment and install the API:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -e '.[dev]'
   ```

5. Copy `.env.example` to `.env`. Fill in the service-role key shown by `pnpm supabase:status` and your Gemini API key.
6. Run `uvicorn app.main:app --reload --port 8000` (or `pnpm api:dev`). API documentation is available at `http://localhost:8000/docs`.

The frontend's ignored `.env` should contain:

```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<PUBLISHABLE_KEY from pnpm supabase:status>
VITE_API_URL=http://localhost:8000
```

## AI endpoints

Both endpoints require `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>` and retain the camelCase payload fields used by the former Edge Functions.

- `POST /api/v1/extract-paper` accepts `importJobId`, `storagePath`, `kind`, `subject`, `year`, and `paperType`. Only admins may call it.
- `POST /api/v1/grade-submission` accepts `submissionId`. Students may grade only their own submissions; admins may grade any submission.

FastAPI uses the service-role key only after it verifies the caller's Supabase token and authorizes access to the requested resource. Never place `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` in frontend environment files.

Useful commands:

- `pnpm api:dev` — run FastAPI with reload on port 8000
- `pnpm api:test` — run the Python test suite
- `pnpm supabase:status` — show local endpoints and keys
- `pnpm db:reset` — recreate the database and apply every migration
- `pnpm supabase:stop` — stop the local containers without losing their volume

The schema seeds Mathematics, Science, free and paid plans, and starter badges. Prices and limits are deliberately stored as data because the product requirements leave them open.

For production, put large import batches behind a durable job queue. The included extraction endpoint waits for Gemini and is intended for the MVP/admin pilot.
