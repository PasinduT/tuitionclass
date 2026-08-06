# Repository guide

## Scope

This repository contains the Pahas Sri Lankan O/L learning platform.

- `frontend/` is a Vite + React application styled with Tailwind CSS.
- `backend/app/` is the FastAPI application. All Gemini calls belong here.
- `backend/supabase/` contains the local Supabase configuration and SQL migrations.

## Working conventions

- Keep secrets out of git. Copy the checked-in `.env.example` files to `.env` for local use.
- Keep privileged Supabase operations in the FastAPI service. Never expose the service-role key to the frontend.
- Browser requests to FastAPI must send the current Supabase access token as a Bearer token.
- Put Gemini prompts, response schemas, and `google-genai` calls in `backend/app/services/gemini.py`; routes should coordinate authorization, persistence, and HTTP responses.
- Preserve API compatibility deliberately. The AI endpoints currently use camelCase request fields because they replace the former Supabase Edge Function contracts.
- Add or update tests for backend behavior when changing schemas, authorization, persistence, or AI response handling.
- Do not edit generated dependency directories such as `node_modules/`, Python virtual environments, or Supabase local runtime state.

## Commands

Frontend commands run from `frontend/`:

- `pnpm dev` — start Vite
- `pnpm build` — create a production build

Backend commands run from `backend/`:

- `python -m venv .venv && source .venv/bin/activate` — create and activate a virtual environment
- `pip install -e '.[dev]'` — install the API and test dependencies
- `uvicorn app.main:app --reload --port 8000` — start FastAPI
- `pytest` — run backend tests
- `pnpm supabase:start` — start local Supabase
- `pnpm db:reset` — recreate the local database from migrations

Before handing off a change, run the narrowest relevant checks and report any check that could not be run.
