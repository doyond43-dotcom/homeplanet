begin;

alter table public.vz_lawncare_requests
  add column if not exists scheduled_for timestamptz,
  add column if not exists scheduling_notes text;

commit;