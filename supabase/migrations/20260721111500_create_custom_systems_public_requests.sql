-- Daniel / Custom Systems
-- Public request intake before a request becomes a private Build Record.
--
-- Security model:
-- - anonymous/public visitors may INSERT only
-- - authenticated operator may SELECT and UPDATE
-- - public visitors cannot read submitted requests
-- - private canonical Build Records remain in custom_systems_build_records

create table public.custom_systems_public_requests (
  id uuid primary key default gen_random_uuid(),

  problem text not null,
  business_name text not null,
  what_you_do text not null,
  current_flow text not null,

  breakdowns jsonb not null default '[]'::jsonb,

  existing_link text,
  name text,
  phone text,
  email text,
  contact_preference text,
  notes text,

  status text not null default 'New Lead',

  claimed_build_record_id text,

  created_at timestamptz not null default now(),
  claimed_at timestamptz,

  constraint custom_systems_public_requests_status_check
    check (status in ('New Lead', 'Claimed')),

  constraint custom_systems_public_requests_problem_length
    check (char_length(problem) between 1 and 200),

  constraint custom_systems_public_requests_business_name_length
    check (char_length(business_name) between 1 and 200),

  constraint custom_systems_public_requests_what_you_do_length
    check (char_length(what_you_do) between 1 and 500),

  constraint custom_systems_public_requests_current_flow_length
    check (char_length(current_flow) between 1 and 5000)
);

create index custom_systems_public_requests_created_at_idx
  on public.custom_systems_public_requests (created_at desc);

create index custom_systems_public_requests_status_idx
  on public.custom_systems_public_requests (status);

alter table public.custom_systems_public_requests
  enable row level security;

-- Public can submit only.
create policy
  "Visitors can submit custom systems requests"
  on public.custom_systems_public_requests
  for insert
  to anon, authenticated
  with check (
    status = 'New Lead'
    and claimed_build_record_id is null
    and claimed_at is null
  );

-- Authenticated operator can read incoming requests.
create policy
  "Authenticated operator can read custom systems requests"
  on public.custom_systems_public_requests
  for select
  to authenticated
  using (true);

-- Authenticated operator can mark a request claimed after pulling it into work.
create policy
  "Authenticated operator can update custom systems requests"
  on public.custom_systems_public_requests
  for update
  to authenticated
  using (true)
  with check (true);

comment on table public.custom_systems_public_requests is
  'Public-safe Daniel Custom Systems intake. Requests stay here until an authenticated operator pulls them into a private canonical Build Record.';