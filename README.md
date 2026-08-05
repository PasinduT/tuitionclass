# TuitionClass

Tuitionclass is a student-first Sri Lankan O/L Mathematics and Science practice platform. It turns past papers into focused practice, gives fast feedback, tracks topic mastery, and keeps progress playful.

## Project layout

- `frontend/` — React, Tailwind CSS, and shadcn-style UI primitives
- `backend/` — Supabase schema, RLS, Storage policies, and Gemini Edge Functions

## Run the web app

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend starts in demo mode when Supabase environment variables are absent, so all main screens and interactions are immediately available. See `frontend/.env.example` when connecting a Supabase project.

## Local Supabase

Docker Desktop and the local Supabase CLI are used for the backend. The frontend is already connected through its ignored `frontend/.env` file.

```bash
# Terminal 1
cd backend
pnpm supabase:start

# Terminal 2
cd frontend
pnpm dev
```

Local services:

- App: `http://localhost:5173`
- Supabase Studio: `http://127.0.0.1:54323`
- API: `http://127.0.0.1:54321`
- Test email inbox: `http://127.0.0.1:54324`

Use `pnpm db:reset` from `backend/` to recreate the database from migrations and `pnpm supabase:stop` to stop the containers. Add a Gemini API key to `backend/supabase/.env.local` before testing AI extraction or grading.

## Current product slice

The UI includes the student dashboard, question bank filters, custom practice builder, MCQ and typed-answer grading flows, AI grading rating/challenge UI, progress analytics, lessons and syllabus updates, leaderboard privacy, and an admin PDF extraction/review workflow.

The backend includes the normalized MVP data model, access policies, private upload buckets, account profile creation, configurable plans, and separate Gemini workflows for paper extraction and answer grading.
