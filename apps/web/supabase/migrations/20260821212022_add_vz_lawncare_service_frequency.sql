alter table public.vz_lawncare_requests
  add column if not exists service_frequency text not null default 'One-Time';

alter table public.vz_lawncare_requests
  drop constraint if exists vz_lawncare_requests_service_frequency_check;

alter table public.vz_lawncare_requests
  add constraint vz_lawncare_requests_service_frequency_check
  check (
    service_frequency in (
      'One-Time',
      'Weekly',
      'Every 2 Weeks'
    )
  );
