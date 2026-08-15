create table if not exists public.marshall_case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.marshall_cases(id) on delete cascade,
  document_name text not null,
  status text not null default 'needed',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint marshall_case_document_status_check
    check (status in ('needed', 'received'))
);

create index if not exists marshall_case_documents_case_idx
on public.marshall_case_documents(case_id, created_at asc);

create unique index if not exists marshall_case_documents_unique_name
on public.marshall_case_documents(case_id, document_name);

alter table public.marshall_case_documents
enable row level security;

grant select, insert, update, delete
on table public.marshall_case_documents
to authenticated;

drop policy if exists "marshall_authenticated_documents_read"
on public.marshall_case_documents;

create policy "marshall_authenticated_documents_read"
on public.marshall_case_documents
for select
to authenticated
using (true);

drop policy if exists "marshall_authenticated_documents_insert"
on public.marshall_case_documents;

create policy "marshall_authenticated_documents_insert"
on public.marshall_case_documents
for insert
to authenticated
with check (true);

drop policy if exists "marshall_authenticated_documents_update"
on public.marshall_case_documents;

create policy "marshall_authenticated_documents_update"
on public.marshall_case_documents
for update
to authenticated
using (true)
with check (true);

drop policy if exists "marshall_authenticated_documents_delete"
on public.marshall_case_documents;

create policy "marshall_authenticated_documents_delete"
on public.marshall_case_documents
for delete
to authenticated
using (true);

insert into public.marshall_case_documents (
  case_id,
  document_name,
  status
)
select
  id,
  'Case Review Intake',
  'received'
from public.marshall_cases
on conflict (case_id, document_name) do nothing;

insert into public.marshall_case_documents (
  case_id,
  document_name,
  status
)
select
  id,
  'Crash Report',
  'needed'
from public.marshall_cases
on conflict (case_id, document_name) do nothing;

insert into public.marshall_case_documents (
  case_id,
  document_name,
  status
)
select
  id,
  'Medical Records',
  'needed'
from public.marshall_cases
on conflict (case_id, document_name) do nothing;

insert into public.marshall_case_documents (
  case_id,
  document_name,
  status
)
select
  id,
  'Insurance Information',
  'needed'
from public.marshall_cases
on conflict (case_id, document_name) do nothing;
