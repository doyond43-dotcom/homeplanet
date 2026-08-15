alter table public.marshall_case_documents
  add column if not exists storage_path text,
  add column if not exists original_filename text,
  add column if not exists mime_type text,
  add column if not exists file_size bigint,
  add column if not exists uploaded_at timestamptz;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'marshall-case-documents',
  'marshall-case-documents',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "marshall authenticated document uploads"
on storage.objects;

create policy "marshall authenticated document uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'marshall-case-documents'
);

drop policy if exists "marshall authenticated document reads"
on storage.objects;

create policy "marshall authenticated document reads"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'marshall-case-documents'
);

drop policy if exists "marshall authenticated document updates"
on storage.objects;

create policy "marshall authenticated document updates"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'marshall-case-documents'
)
with check (
  bucket_id = 'marshall-case-documents'
);

drop policy if exists "marshall authenticated document deletes"
on storage.objects;

create policy "marshall authenticated document deletes"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'marshall-case-documents'
);
