-- Daniel / Custom Systems
-- One Build Record is the source of truth.
--
-- The full canonical CustomSystemsBuildRecord is stored together as JSONB.
-- Board lanes, drawer state, customer review state, communication history,
-- timeline, launch state, and ongoing state all remain attached to this record.
--
-- Private operator data:
-- every row belongs to the authenticated user who created it.

create table if not exists public.custom_systems_build_records (
  id text primary key,

  owner_id uuid not null default auth.uid(),

  record jsonb not null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

create index if not exists custom_systems_build_records_owner_id_idx
  on public.custom_systems_build_records (owner_id);

create index if not exists custom_systems_build_records_updated_at_idx
  on public.custom_systems_build_records (updated_at desc);

alter table public.custom_systems_build_records
  enable row level security;

drop policy if exists
  "Owners can read custom systems build records"
  on public.custom_systems_build_records;

create policy
  "Owners can read custom systems build records"
  on public.custom_systems_build_records
  for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists
  "Owners can create custom systems build records"
  on public.custom_systems_build_records;

create policy
  "Owners can create custom systems build records"
  on public.custom_systems_build_records
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists
  "Owners can update custom systems build records"
  on public.custom_systems_build_records;

create policy
  "Owners can update custom systems build records"
  on public.custom_systems_build_records
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists
  "Owners can delete custom systems build records"
  on public.custom_systems_build_records;

create policy
  "Owners can delete custom systems build records"
  on public.custom_systems_build_records
  for delete
  to authenticated
  using (owner_id = auth.uid());

comment on table public.custom_systems_build_records is
  'Canonical Daniel / Custom Systems Build Records. One row is one source-of-truth Build Record.';