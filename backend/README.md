# Pahas backend

The backend is a Supabase project containing the Postgres model, row-level security, Storage buckets, Auth profile trigger, and Gemini-powered Edge Functions.

## Local setup

1. Start Docker Desktop.
2. Run `pnpm install` and `pnpm supabase:start` from `backend/`.
3. The checked-in migration is applied automatically and the local dashboard opens at `http://127.0.0.1:54323`.
4. Add `GEMINI_API_KEY` to the ignored `backend/supabase/.env.local` file.
5. Run `pnpm functions:serve` when testing the Gemini functions interactively.

The frontend's ignored `.env` should contain:

```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<PUBLISHABLE_KEY from pnpm supabase:status>
```

Useful commands:

- `pnpm supabase:status` — show local endpoints and keys
- `pnpm db:reset` — recreate the database and apply every migration
- `pnpm supabase:stop` — stop the local containers without losing their volume

The schema seeds Mathematics, Science, free and paid plans, and starter badges. Prices and limits are deliberately stored as data because the product requirements leave them open.

For production, configure asynchronous import processing before uploading large batches. The included extraction function is synchronous and intended for the MVP/admin pilot.
