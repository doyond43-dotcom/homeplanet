create extension if not exists pgcrypto;

create table if not exists public.performance_powerboat_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  project_type text not null,
  status text not null default 'new',
  priority text not null default 'normal',

  customer_name text not null,
  customer_phone text not null,
  customer_email text,

  boat_year text,
  boat_make_model text,
  boat_length text,
  boat_engines text,
  boat_location text,
  customer_request text,

  current_milestone text not null default 'New Request',
  next_action text not null default 'Review request and contact customer',
  assigned_to text,
  next_date timestamptz,
  waiting_on text,

  max_observed text,
  team_found text,
  recommended_work text,
  work_performed text,
  internal_notes text,

  proof_photos jsonb not null default '[]'::jsonb,
  labor jsonb not null default '[]'::jsonb,
  parts jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb
);

alter table public.performance_powerboat_projects enable row level security;

drop policy if exists "performance_powerboat_public_insert"
on public.performance_powerboat_projects;

create policy "performance_powerboat_public_insert"
on public.performance_powerboat_projects
for insert
to anon, authenticated
with check (true);

drop policy if exists "performance_powerboat_authenticated_read"
on public.performance_powerboat_projects;

create policy "performance_powerboat_authenticated_read"
on public.performance_powerboat_projects
for select
to authenticated
using (true);

drop policy if exists "performance_powerboat_authenticated_update"
on public.performance_powerboat_projects;

create policy "performance_powerboat_authenticated_update"
on public.performance_powerboat_projects
for update
to authenticated
using (true)
with check (true);

create index if not exists performance_powerboat_projects_created_at_idx
on public.performance_powerboat_projects(created_at desc);

create index if not exists performance_powerboat_projects_status_idx
on public.performance_powerboat_projects(status);
