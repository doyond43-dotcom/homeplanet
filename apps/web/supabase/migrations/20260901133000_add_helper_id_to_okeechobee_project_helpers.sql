alter table public.okeechobee_project_helpers
add column if not exists helper_id uuid
references public.okeechobee_helpers(id)
on delete set null;

create index if not exists
okeechobee_project_helpers_helper_id_idx
on public.okeechobee_project_helpers(helper_id);

update public.okeechobee_project_helpers ph
set helper_id = h.id
from public.okeechobee_helpers h
where ph.helper_id is null
  and ph.email is not null
  and lower(trim(ph.email)) = lower(trim(h.email));
