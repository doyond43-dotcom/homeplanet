alter table public.late_night_hotel_requests
  add column if not exists tracking_token uuid;

update public.late_night_hotel_requests
set tracking_token = gen_random_uuid()
where tracking_token is null;

alter table public.late_night_hotel_requests
  alter column tracking_token set default gen_random_uuid();

alter table public.late_night_hotel_requests
  alter column tracking_token set not null;

create unique index if not exists
  late_night_hotel_requests_tracking_token_idx
  on public.late_night_hotel_requests (tracking_token);

create or replace function public.get_late_night_hotel_request_status(
  p_tracking_token uuid
)
returns table (
  status text,
  current_property text,
  quoted_price text,
  confirmed_property text,
  confirmed_rate text,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.status,
    r.current_property,
    r.quoted_price,
    r.confirmed_property,
    r.confirmed_rate,
    r.updated_at
  from public.late_night_hotel_requests r
  where r.tracking_token = p_tracking_token
  limit 1;
$$;

revoke all
  on function public.get_late_night_hotel_request_status(uuid)
  from public;

grant execute
  on function public.get_late_night_hotel_request_status(uuid)
  to anon, authenticated;

comment on function public.get_late_night_hotel_request_status(uuid) is
'Returns only traveler-safe late-night hotel request status fields for one high-entropy tracking token.';