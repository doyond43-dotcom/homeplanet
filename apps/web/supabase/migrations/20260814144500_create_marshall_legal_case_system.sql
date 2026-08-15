create extension if not exists pgcrypto;

create table if not exists public.marshall_cases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  case_number text not null unique,
  case_type text not null default 'Personal Injury',
  status text not null default 'new_review',

  client_first_name text not null,
  client_last_name text,
  client_phone text not null,
  client_email text,

  incident_date date,
  incident_location text,
  incident_details text not null,

  injured text,
  treatment text,
  preferred_contact text,
  best_contact_time text,

  next_action text not null default 'Review case and contact client',
  assigned_to text,
  internal_notes text
);

create table if not exists public.marshall_case_truth_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.marshall_cases(id) on delete cascade,
  event_type text not null,
  event_label text not null,
  event_detail text,
  event_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists marshall_cases_created_at_idx
on public.marshall_cases(created_at desc);

create index if not exists marshall_cases_status_idx
on public.marshall_cases(status);

create index if not exists marshall_cases_phone_idx
on public.marshall_cases(client_phone);

create index if not exists marshall_case_truth_case_idx
on public.marshall_case_truth_events(case_id, created_at asc);

create or replace function public.marshall_create_initial_truth_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.marshall_case_truth_events (
    case_id,
    event_type,
    event_label,
    event_detail,
    event_meta
  )
  values (
    new.id,
    'case_review_submitted',
    'Case review submitted',
    'Customer submitted a new case review.',
    jsonb_build_object(
      'case_number', new.case_number,
      'case_type', new.case_type
    )
  );

  return new;
end;
$$;

drop trigger if exists marshall_case_initial_truth_trigger
on public.marshall_cases;

create trigger marshall_case_initial_truth_trigger
after insert on public.marshall_cases
for each row
execute function public.marshall_create_initial_truth_event();

alter table public.marshall_cases enable row level security;
alter table public.marshall_case_truth_events enable row level security;

grant insert on table public.marshall_cases to anon, authenticated;
grant select, update on table public.marshall_cases to authenticated;

grant select, insert, update
on table public.marshall_case_truth_events
to authenticated;

drop policy if exists "marshall_public_case_insert"
on public.marshall_cases;

create policy "marshall_public_case_insert"
on public.marshall_cases
for insert
to anon, authenticated
with check (true);

drop policy if exists "marshall_authenticated_case_read"
on public.marshall_cases;

create policy "marshall_authenticated_case_read"
on public.marshall_cases
for select
to authenticated
using (true);

drop policy if exists "marshall_authenticated_case_update"
on public.marshall_cases;

create policy "marshall_authenticated_case_update"
on public.marshall_cases
for update
to authenticated
using (true)
with check (true);

drop policy if exists "marshall_public_truth_insert"
on public.marshall_case_truth_events;

drop policy if exists "marshall_authenticated_truth_read"
on public.marshall_case_truth_events;

create policy "marshall_authenticated_truth_read"
on public.marshall_case_truth_events
for select
to authenticated
using (true);

drop policy if exists "marshall_authenticated_truth_insert"
on public.marshall_case_truth_events;

create policy "marshall_authenticated_truth_insert"
on public.marshall_case_truth_events
for insert
to authenticated
with check (true);

drop policy if exists "marshall_authenticated_truth_update"
on public.marshall_case_truth_events;

create policy "marshall_authenticated_truth_update"
on public.marshall_case_truth_events
for update
to authenticated
using (true)
with check (true);
