alter table public.okeechobee_project_helpers
add column if not exists status text not null default 'new';

alter table public.okeechobee_project_helpers
drop constraint if exists okeechobee_project_helpers_status_check;

alter table public.okeechobee_project_helpers
add constraint okeechobee_project_helpers_status_check
check (
  status in (
    'new',
    'contacted',
    'confirmed',
    'scheduled',
    'completed',
    'couldnt_help'
  )
);
