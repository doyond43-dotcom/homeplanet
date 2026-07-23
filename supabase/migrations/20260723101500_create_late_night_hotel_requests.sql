create table if not exists public.late_night_hotel_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  traveler_name text not null,
  traveler_phone text not null,

  location text not null,
  timing text not null,
  intent text not null,

  requested_property text not null,
  current_property text not null,
  quoted_price text,

  status text not null default 'Needs Confirmation'
    check (
      status in (
        'Needs Confirmation',
        'Contacting Property',
        'Confirmed',
        'Declined',
        'Matching Another Property'
      )
    ),

  confirmed_property text,
  confirmed_rate text,
  confirmed_at timestamptz,
  declined_at timestamptz,
  closed_at timestamptz,
  outcome text
);

create index if not exists late_night_hotel_requests_created_at_idx
  on public.late_night_hotel_requests (created_at desc);

create index if not exists late_night_hotel_requests_status_idx
  on public.late_night_hotel_requests (status);

alter table public.late_night_hotel_requests
  enable row level security;

drop policy if exists
  "Visitors can submit late night hotel requests"
  on public.late_night_hotel_requests;

create policy
  "Visitors can submit late night hotel requests"
  on public.late_night_hotel_requests
  for insert
  to anon, authenticated
  with check (
    status = 'Needs Confirmation'
    and confirmed_property is null
    and confirmed_at is null
    and declined_at is null
    and closed_at is null
  );

drop policy if exists
  "Authenticated operator can read late night hotel requests"
  on public.late_night_hotel_requests;

create policy
  "Authenticated operator can read late night hotel requests"
  on public.late_night_hotel_requests
  for select
  to authenticated
  using (true);

drop policy if exists
  "Authenticated operator can update late night hotel requests"
  on public.late_night_hotel_requests;

create policy
  "Authenticated operator can update late night hotel requests"
  on public.late_night_hotel_requests
  for update
  to authenticated
  using (true)
  with check (true);

comment on table public.late_night_hotel_requests is
'Late Night Hotels Level One traveler demand records. Public visitors can submit requests but cannot browse or update other traveler requests. Authenticated operators can read and move requests through property confirmation and matching outcomes.';
