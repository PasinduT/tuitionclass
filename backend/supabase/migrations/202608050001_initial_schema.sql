create extension if not exists "pgcrypto";

create type public.app_role as enum ('student', 'admin');
create type public.content_status as enum ('extracted', 'needs_review', 'approved', 'rejected', 'archived');
create type public.content_visibility as enum ('public', 'draft', 'archived');
create type public.import_kind as enum ('question_paper', 'marking_scheme');
create type public.import_status as enum ('uploaded', 'processing', 'review_ready', 'completed', 'failed');
create type public.submission_status as enum ('not_started', 'in_progress', 'submitted', 'auto_graded', 'challenged', 'challenge_reviewed', 'returned', 'needs_resubmission');
create type public.question_format as enum ('multiple_choice', 'structured', 'short_answer', 'essay', 'calculation', 'diagram', 'mixed');
create type public.difficulty_level as enum ('easy', 'medium', 'hard');
create type public.grading_rating as enum ('accurate', 'mostly_accurate', 'somewhat_wrong', 'completely_wrong');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  full_name text not null check (char_length(full_name) between 2 and 100),
  date_of_birth date,
  avatar_key text default 'leaf',
  leaderboard_visible boolean not null default true,
  plan_key text not null default 'free',
  points integer not null default 0 check (points >= 0),
  level integer not null default 1 check (level > 0),
  streak_days integer not null default 0 check (streak_days >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name in ('Mathematics', 'Science')),
  slug text not null unique,
  medium text not null default 'English' check (medium = 'English'),
  active boolean not null default true
);

create table public.student_subjects (
  student_id uuid references public.profiles(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, subject_id)
);

create table public.syllabuses (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  education_level text not null default 'O Level' check (education_level = 'O Level'),
  effective_from integer not null,
  effective_to integer,
  is_current boolean not null default false,
  unique(subject_id, name)
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  syllabus_id uuid not null references public.syllabuses(id) on delete cascade,
  parent_id uuid references public.topics(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  unique(syllabus_id, parent_id, slug)
);

create table public.source_papers (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id),
  syllabus_id uuid references public.syllabuses(id),
  year integer not null check (year between 1980 and 2100),
  paper_type text not null,
  storage_path text not null,
  original_filename text not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(subject_id, year, paper_type, storage_path)
);

create table public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  source_paper_id uuid references public.source_papers(id) on delete cascade,
  kind public.import_kind not null,
  status public.import_status not null default 'uploaded',
  progress smallint not null default 0 check (progress between 0 and 100),
  provider text not null default 'gemini' check (provider = 'gemini'),
  provider_model text,
  error_message text,
  result_summary jsonb not null default '{}'::jsonb,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id),
  syllabus_id uuid references public.syllabuses(id),
  topic_id uuid references public.topics(id),
  subtopic_id uuid references public.topics(id),
  source_paper_id uuid references public.source_papers(id),
  import_job_id uuid references public.import_jobs(id),
  question_number text,
  body text not null,
  assets jsonb not null default '[]'::jsonb,
  options jsonb,
  correct_answer jsonb,
  model_answer text,
  grading_guidance text,
  marks numeric(6,2) not null default 1 check (marks > 0),
  difficulty public.difficulty_level not null default 'medium',
  format public.question_format not null,
  tags text[] not null default '{}',
  extraction_confidence numeric(5,2),
  original_context jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'extracted',
  visibility public.content_visibility not null default 'draft',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marking_scheme_entries (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.questions(id) on delete cascade,
  import_job_id uuid references public.import_jobs(id) on delete set null,
  question_number text,
  model_answer text not null,
  mark_allocation jsonb not null default '[]'::jsonb,
  grading_guidance text,
  status public.content_status not null default 'needs_review',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  subject_id uuid references public.subjects(id),
  filters jsonb not null default '{}'::jsonb,
  time_limit_minutes integer check (time_limit_minutes > 0),
  status text not null default 'draft' check (status in ('draft', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.assessment_questions (
  assessment_id uuid references public.assessments(id) on delete cascade,
  question_id uuid references public.questions(id),
  sort_order integer not null,
  primary key (assessment_id, question_id),
  unique(assessment_id, sort_order)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references public.assessments(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  student_id uuid not null references public.profiles(id) on delete cascade,
  answer jsonb not null default '{}'::jsonb,
  upload_paths text[] not null default '{}',
  status public.submission_status not null default 'not_started',
  started_at timestamptz,
  submitted_at timestamptz,
  time_taken_seconds integer check (time_taken_seconds >= 0),
  created_at timestamptz not null default now()
);

create table public.grading_results (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.submissions(id) on delete cascade,
  marks_earned numeric(6,2) not null check (marks_earned >= 0),
  total_marks numeric(6,2) not null check (total_marks > 0),
  is_correct boolean,
  feedback text not null,
  mistake_explanation text,
  suggested_answer text,
  topic_weakness_signal numeric(5,2),
  recommended_content jsonb not null default '[]'::jsonb,
  model text not null,
  raw_response jsonb,
  leaderboard_points integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.grading_feedback (
  id uuid primary key default gen_random_uuid(),
  grading_result_id uuid not null references public.grading_results(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  rating public.grading_rating not null,
  created_at timestamptz not null default now(),
  unique(grading_result_id, student_id)
);

create table public.grade_challenges (
  id uuid primary key default gen_random_uuid(),
  grading_result_id uuid not null references public.grading_results(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 10 and 2000),
  status text not null default 'open' check (status in ('open', 'reviewing', 'upheld', 'adjusted', 'closed')),
  corrected_marks numeric(6,2),
  review_note text,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.topic_mastery (
  student_id uuid references public.profiles(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  attempts integer not null default 0,
  marks_earned numeric(10,2) not null default 0,
  marks_available numeric(10,2) not null default 0,
  mastery_score numeric(5,2) not null default 0 check (mastery_score between 0 and 100),
  trend text not null default 'steady' check (trend in ('strong', 'improving', 'steady', 'weak', 'urgent')),
  last_practised_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, topic_id)
);

create table public.learning_content (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id),
  syllabus_id uuid references public.syllabuses(id),
  topic_id uuid references public.topics(id),
  kind text not null check (kind in ('lesson', 'note', 'syllabus_change')),
  title text not null,
  summary text,
  body jsonb not null default '{}'::jsonb,
  external_url text,
  visibility public.content_visibility not null default 'draft',
  published_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text not null,
  icon_key text not null,
  criteria jsonb not null default '{}'::jsonb
);

create table public.student_badges (
  student_id uuid references public.profiles(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (student_id, badge_id)
);

create table public.plans (
  key text primary key,
  name text not null,
  monthly_price_lkr integer not null check (monthly_price_lkr >= 0),
  limits jsonb not null default '{}'::jsonb,
  active boolean not null default true
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  plan_key text not null references public.plans(key),
  provider text,
  provider_subscription_id text unique,
  status text not null check (status in ('trialing', 'active', 'past_due', 'cancelled', 'expired')),
  beta_discount_percent integer not null default 0 check (beta_discount_percent between 0 and 100),
  period_ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.admin_audit_log (
  id bigint generated always as identity primary key,
  admin_id uuid not null references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index questions_public_idx on public.questions(subject_id, topic_id, status, visibility);
create index submissions_student_idx on public.submissions(student_id, created_at desc);
create index import_jobs_status_idx on public.import_jobs(status, created_at);
create index learning_content_lookup_idx on public.learning_content(subject_id, topic_id, kind, visibility);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles(id, full_name, date_of_birth)
  values(new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)), nullif(new.raw_user_meta_data ->> 'date_of_birth', '')::date);
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.student_subjects enable row level security;
alter table public.subjects enable row level security;
alter table public.syllabuses enable row level security;
alter table public.topics enable row level security;
alter table public.source_papers enable row level security;
alter table public.import_jobs enable row level security;
alter table public.questions enable row level security;
alter table public.marking_scheme_entries enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.submissions enable row level security;
alter table public.grading_results enable row level security;
alter table public.grading_feedback enable row level security;
alter table public.grade_challenges enable row level security;
alter table public.topic_mastery enable row level security;
alter table public.learning_content enable row level security;
alter table public.badges enable row level security;
alter table public.student_badges enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.admin_audit_log enable row level security;

create policy "profiles own read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "catalog public read" on public.subjects for select using (true);
create policy "syllabuses public read" on public.syllabuses for select using (true);
create policy "topics public read" on public.topics for select using (true);
create policy "approved questions read" on public.questions for select using ((status = 'approved' and visibility = 'public') or public.is_admin());
create policy "published content read" on public.learning_content for select using (visibility = 'public' or public.is_admin());
create policy "badges public read" on public.badges for select using (true);
create policy "plans public read" on public.plans for select using (active);
create policy "student subjects own all" on public.student_subjects for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "assessments own all" on public.assessments for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "assessment questions own all" on public.assessment_questions for all
  using (exists(select 1 from public.assessments a where a.id = assessment_id and a.student_id = auth.uid()))
  with check (exists(select 1 from public.assessments a where a.id = assessment_id and a.student_id = auth.uid()));
create policy "submissions own all" on public.submissions for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "grading results own read" on public.grading_results for select using (exists(select 1 from public.submissions s where s.id = submission_id and s.student_id = auth.uid()));
create policy "grading feedback own all" on public.grading_feedback for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "challenges own create and read" on public.grade_challenges for all using (student_id = auth.uid() or public.is_admin()) with check (student_id = auth.uid() or public.is_admin());
create policy "mastery own read" on public.topic_mastery for select using (student_id = auth.uid() or public.is_admin());
create policy "student badges own read" on public.student_badges for select using (student_id = auth.uid() or public.is_admin());
create policy "subscriptions own read" on public.subscriptions for select using (student_id = auth.uid() or public.is_admin());

create policy "admins manage subjects" on public.subjects for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage syllabuses" on public.syllabuses for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage topics" on public.topics for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage papers" on public.source_papers for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage imports" on public.import_jobs for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage questions" on public.questions for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage schemes" on public.marking_scheme_entries for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage content" on public.learning_content for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read audit" on public.admin_audit_log for select using (public.is_admin());

-- RLS decides which rows are visible; these base grants decide which operations
-- the API roles may attempt in the first place.
grant select on public.subjects, public.syllabuses, public.topics, public.questions,
  public.learning_content, public.badges, public.plans to anon;
grant all privileges on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Students may edit only their non-authoritative profile fields. Role, plan,
-- points, level, and streak remain server-controlled even when RLS passes.
revoke update on public.profiles from authenticated;
grant update(full_name, date_of_birth, avatar_key, leaderboard_visible, updated_at) on public.profiles to authenticated;

-- Expose a deliberately narrow leaderboard shape without leaking email-linked
-- profile data such as date of birth.
create or replace function public.get_global_leaderboard(result_limit integer default 100)
returns table(student_id uuid, display_name text, avatar_key text, points integer, level integer, rank_position bigint)
language sql stable security definer set search_path = public
as $$
  select id, full_name, profiles.avatar_key, profiles.points, profiles.level,
         rank() over(order by profiles.points desc)
  from public.profiles
  where role = 'student' and leaderboard_visible
  order by profiles.points desc
  limit least(greatest(result_limit, 1), 100);
$$;
grant execute on function public.get_global_leaderboard(integer) to authenticated;

insert into public.subjects(name, slug) values ('Mathematics', 'mathematics'), ('Science', 'science');
insert into public.plans(key, name, monthly_price_lkr, limits) values
  ('free', 'Starter', 0, '{"subjects":1,"questions_per_day":10,"assessments_per_month":3,"progress_days":30}'),
  ('student_monthly', 'Pahas Plus', 1490, '{"subjects":2,"questions_per_day":null,"assessments_per_month":null,"progress_days":null}');
insert into public.badges(key, name, description, icon_key, criteria) values
  ('first_steps', 'First Steps', 'Complete your first practice question.', 'footprints', '{"questions":1}'),
  ('algebra_ace', 'Algebra Ace', 'Reach 80% Algebra mastery.', 'medal', '{"topic":"algebra","mastery":80}'),
  ('streak_10', 'On a Roll', 'Practise for 10 consecutive days.', 'flame', '{"streak":10}');

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values
  ('papers', 'papers', false, 52428800, array['application/pdf']),
  ('answer-sheets', 'answer-sheets', false, 20971520, array['application/pdf','image/jpeg','image/png','image/webp']),
  ('question-assets', 'question-assets', true, 10485760, array['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do nothing;

create policy "admins upload papers" on storage.objects for insert to authenticated with check (bucket_id = 'papers' and public.is_admin());
create policy "students upload own answers" on storage.objects for insert to authenticated with check (bucket_id = 'answer-sheets' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "students read own answers" on storage.objects for select to authenticated using (bucket_id = 'answer-sheets' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy "public question assets" on storage.objects for select using (bucket_id = 'question-assets');
