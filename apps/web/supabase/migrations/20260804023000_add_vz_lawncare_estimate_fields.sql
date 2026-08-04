begin;

alter table public.vz_lawncare_requests
  add column if not exists estimate_amount numeric(10, 2),
  add column if not exists estimate_notes text,
  add column if not exists estimate_sent_at timestamptz;

alter table public.vz_lawncare_requests
  drop constraint if exists vz_lawncare_estimate_amount_check;

alter table public.vz_lawncare_requests
  add constraint vz_lawncare_estimate_amount_check
  check (
    estimate_amount is null
    or estimate_amount >= 0
  );

commit;