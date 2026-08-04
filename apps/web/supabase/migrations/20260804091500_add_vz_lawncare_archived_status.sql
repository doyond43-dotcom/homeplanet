begin;

alter table public.vz_lawncare_requests
  drop constraint if exists vz_lawncare_request_status_check;

alter table public.vz_lawncare_requests
  add constraint vz_lawncare_request_status_check
  check (
    request_status in (
      'new',
      'reviewing',
      'estimate_sent',
      'approved',
      'scheduled',
      'in_progress',
      'completed',
      'closed',
      'archived'
    )
  );

commit;