create table if not exists public.marshall_document_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  case_id uuid not null
    references public.marshall_cases(id)
    on delete cascade,

  document_id uuid not null
    references public.marshall_case_documents(id)
    on delete cascade,

  token_hash text not null unique,

  client_phone text not null,
  status text not null default 'pending',
  expires_at timestamptz not null,
  completed_at timestamptz,

  constraint marshall_document_request_status_check
    check (status in ('pending', 'completed', 'revoked', 'expired'))
);

create index if not exists marshall_document_requests_document_idx
on public.marshall_document_requests(document_id, created_at desc);

create index if not exists marshall_document_requests_case_idx
on public.marshall_document_requests(case_id, created_at desc);

alter table public.marshall_document_requests
enable row level security;

grant select
on table public.marshall_document_requests
to authenticated;

drop policy if exists "marshall authenticated document request read"
on public.marshall_document_requests;

create policy "marshall authenticated document request read"
on public.marshall_document_requests
for select
to authenticated
using (true);
