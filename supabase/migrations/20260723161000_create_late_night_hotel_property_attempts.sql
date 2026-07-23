create table if not exists public.late_night_hotel_property_attempts (
  id uuid primary key default gen_random_uuid(),

  request_id uuid not null
    references public.late_night_hotel_requests(id)
    on delete cascade,

  property_name text not null,
  quoted_price text,

  status text not null default 'Needs Confirmation'
    check (
      status in (
        'Needs Confirmation',
        'Contacting Property',
        'Confirmed',
        'Declined'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contacted_at timestamptz,
  resolved_at timestamptz
);

create index if not exists
  late_night_hotel_property_attempts_request_idx
  on public.late_night_hotel_property_attempts
  (request_id, created_at);

alter table public.late_night_hotel_property_attempts
  enable row level security;

drop policy if exists
  "Authenticated operator can read hotel property attempts"
  on public.late_night_hotel_property_attempts;

create policy
  "Authenticated operator can read hotel property attempts"
  on public.late_night_hotel_property_attempts
  for select
  to authenticated
  using (true);

drop policy if exists
  "Authenticated operator can insert hotel property attempts"
  on public.late_night_hotel_property_attempts;

create policy
  "Authenticated operator can insert hotel property attempts"
  on public.late_night_hotel_property_attempts
  for insert
  to authenticated
  with check (true);

drop policy if exists
  "Authenticated operator can update hotel property attempts"
  on public.late_night_hotel_property_attempts;

create policy
  "Authenticated operator can update hotel property attempts"
  on public.late_night_hotel_property_attempts
  for update
  to authenticated
  using (true)
  with check (true);

-- Backfill the originally requested property for existing requests.
insert into public.late_night_hotel_property_attempts (
  request_id,
  property_name,
  quoted_price,
  status,
  created_at,
  updated_at,
  resolved_at
)
select
  r.id,
  r.requested_property,
  case
    when r.requested_property = r.current_property then r.quoted_price
    else null
  end,
  case
    when r.requested_property <> r.current_property then 'Declined'
    when r.status = 'Confirmed' then 'Confirmed'
    when r.status = 'Declined' then 'Declined'
    when r.status = 'Contacting Property' then 'Contacting Property'
    else 'Needs Confirmation'
  end,
  r.created_at,
  r.updated_at,
  case
    when r.requested_property <> r.current_property
      or r.status in ('Confirmed', 'Declined')
    then r.updated_at
    else null
  end
from public.late_night_hotel_requests r
where not exists (
  select 1
  from public.late_night_hotel_property_attempts a
  where a.request_id = r.id
    and a.property_name = r.requested_property
);

-- If a request has already moved to another property, preserve that
-- current property as the next attempt.
insert into public.late_night_hotel_property_attempts (
  request_id,
  property_name,
  quoted_price,
  status,
  created_at,
  updated_at,
  resolved_at
)
select
  r.id,
  r.current_property,
  r.quoted_price,
  case
    when r.status = 'Confirmed' then 'Confirmed'
    when r.status = 'Declined' then 'Declined'
    when r.status = 'Contacting Property' then 'Contacting Property'
    else 'Needs Confirmation'
  end,
  r.updated_at,
  r.updated_at,
  case
    when r.status in ('Confirmed', 'Declined')
    then r.updated_at
    else null
  end
from public.late_night_hotel_requests r
where r.current_property <> r.requested_property
  and not exists (
    select 1
    from public.late_night_hotel_property_attempts a
    where a.request_id = r.id
      and a.property_name = r.current_property
  );

comment on table public.late_night_hotel_property_attempts is
'Persistent truth chain of every hotel or motel attempted for one Late Night Hotels traveler request.';