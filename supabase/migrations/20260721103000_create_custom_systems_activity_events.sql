-- Daniel / Custom Systems
-- Live Activity / Intelligence event stream
--
-- Purpose:
-- Capture anonymous public interaction signals from the Custom Systems Live Page.
--
-- Security model:
-- - anon/authenticated visitors may INSERT analytics events only.
-- - anonymous visitors cannot SELECT, UPDATE, or DELETE analytics.
-- - authenticated operator tools may SELECT analytics.
-- - no customer request/form payload belongs in this table.
--
-- This table does NOT replace the private Build Record table.

create table if not exists public.custom_systems_activity_events (
  id uuid primary key default gen_random_uuid(),

  event_name text not null,

  page_path text not null default '/planet/custom-systems',

  session_id text not null,

  visitor_id text not null,

  source text,

  referrer text,

  label text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),

  constraint custom_systems_activity_event_name_length
    check (char_length(event_name) between 1 and 80),

  constraint custom_systems_activity_page_path_length
    check (char_length(page_path) between 1 and 300),

  constraint custom_systems_activity_session_id_length
    check (char_length(session_id) between 1 and 120),

  constraint custom_systems_activity_visitor_id_length
    check (char_length(visitor_id) between 1 and 120),

  constraint custom_systems_activity_source_length
    check (source is null or char_length(source) <= 120),

  constraint custom_systems_activity_referrer_length
    check (referrer is null or char_length(referrer) <= 1000),

  constraint custom_systems_activity_label_length
    check (label is null or char_length(label) <= 200)
);

create index if not exists custom_systems_activity_created_at_idx
  on public.custom_systems_activity_events (created_at desc);

create index if not exists custom_systems_activity_event_name_idx
  on public.custom_systems_activity_events (event_name);

create index if not exists custom_systems_activity_session_id_idx
  on public.custom_systems_activity_events (session_id);

create index if not exists custom_systems_activity_source_idx
  on public.custom_systems_activity_events (source);

alter table public.custom_systems_activity_events
  enable row level security;

-- ------------------------------------------------------------
-- Public write-only analytics
-- ------------------------------------------------------------

drop policy if exists
  "Visitors can create custom systems activity events"
  on public.custom_systems_activity_events;

create policy
  "Visitors can create custom systems activity events"
  on public.custom_systems_activity_events
  for insert
  to anon, authenticated
  with check (
    event_name in (
      'page_view',
      'start_here_click',
      'show_need_click',
      'how_it_works_click',
      'problem_selected',
      'request_opened',
      'request_started',
      'request_submitted'
    )
    and page_path = '/planet/custom-systems'
  );

-- ------------------------------------------------------------
-- Private operator read access
-- ------------------------------------------------------------

drop policy if exists
  "Authenticated operator can read custom systems activity"
  on public.custom_systems_activity_events;

create policy
  "Authenticated operator can read custom systems activity"
  on public.custom_systems_activity_events
  for select
  to authenticated
  using (true);

comment on table public.custom_systems_activity_events is
  'Anonymous write-only Live Activity events for Daniel / Custom Systems intelligence. Customer request payloads do not belong here.';