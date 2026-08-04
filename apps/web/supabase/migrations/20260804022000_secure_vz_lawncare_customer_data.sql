begin;

revoke select, update, delete
on table public.vz_lawncare_requests
from anon;

revoke select, insert
on table public.vz_lawncare_truth_events
from anon;

revoke select, insert, delete
on table public.vz_lawncare_request_photos
from anon;


drop policy if exists
  "VZ lawncare requests can be read"
on public.vz_lawncare_requests;

create policy
  "Authenticated users can read VZ lawncare requests"
on public.vz_lawncare_requests
for select
to authenticated
using (
  business_slug = 'vz-professional-lawncare'
);


drop policy if exists
  "VZ lawncare requests can be updated"
on public.vz_lawncare_requests;

create policy
  "Authenticated users can update VZ lawncare requests"
on public.vz_lawncare_requests
for update
to authenticated
using (
  business_slug = 'vz-professional-lawncare'
)
with check (
  business_slug = 'vz-professional-lawncare'
);


drop policy if exists
  "VZ lawncare requests can be deleted"
on public.vz_lawncare_requests;

create policy
  "Authenticated users can delete VZ lawncare requests"
on public.vz_lawncare_requests
for delete
to authenticated
using (
  business_slug = 'vz-professional-lawncare'
);


drop policy if exists
  "VZ lawncare truth events can be read"
on public.vz_lawncare_truth_events;

create policy
  "Authenticated users can read VZ lawncare truth events"
on public.vz_lawncare_truth_events
for select
to authenticated
using (
  business_slug = 'vz-professional-lawncare'
);


drop policy if exists
  "VZ lawncare truth events can be recorded"
on public.vz_lawncare_truth_events;

create policy
  "Authenticated users can record VZ lawncare truth events"
on public.vz_lawncare_truth_events
for insert
to authenticated
with check (
  business_slug = 'vz-professional-lawncare'
  and request_id is not null
  and jsonb_typeof(event_meta) = 'object'
);


drop policy if exists
  "VZ lawncare photos can be read"
on public.vz_lawncare_request_photos;

create policy
  "Authenticated users can read VZ lawncare photos"
on public.vz_lawncare_request_photos
for select
to authenticated
using (
  business_slug = 'vz-professional-lawncare'
);


drop policy if exists
  "VZ lawncare photos can be recorded"
on public.vz_lawncare_request_photos;

create policy
  "Authenticated users can record VZ lawncare photos"
on public.vz_lawncare_request_photos
for insert
to authenticated
with check (
  business_slug = 'vz-professional-lawncare'
  and request_id is not null
  and photo_type in ('before', 'after')
);


drop policy if exists
  "VZ lawncare photos can be deleted"
on public.vz_lawncare_request_photos;

create policy
  "Authenticated users can delete VZ lawncare photos"
on public.vz_lawncare_request_photos
for delete
to authenticated
using (
  business_slug = 'vz-professional-lawncare'
);

commit;