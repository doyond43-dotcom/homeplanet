begin;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'vz-lawncare-job-photos',
  'vz-lawncare-job-photos',
  false,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.vz_lawncare_request_photos
  alter column public_url drop not null;

drop policy if exists
  "Authenticated users can view VZ lawncare job photos"
on storage.objects;

create policy
  "Authenticated users can view VZ lawncare job photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'vz-lawncare-job-photos'
);

drop policy if exists
  "Authenticated users can upload VZ lawncare job photos"
on storage.objects;

create policy
  "Authenticated users can upload VZ lawncare job photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'vz-lawncare-job-photos'
  and lower(storage.extension(name)) in (
    'jpg',
    'jpeg',
    'png',
    'webp',
    'heic',
    'heif'
  )
);

drop policy if exists
  "Authenticated users can update VZ lawncare job photos"
on storage.objects;

create policy
  "Authenticated users can update VZ lawncare job photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'vz-lawncare-job-photos'
)
with check (
  bucket_id = 'vz-lawncare-job-photos'
);

drop policy if exists
  "Authenticated users can delete VZ lawncare job photos"
on storage.objects;

create policy
  "Authenticated users can delete VZ lawncare job photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'vz-lawncare-job-photos'
);

commit;