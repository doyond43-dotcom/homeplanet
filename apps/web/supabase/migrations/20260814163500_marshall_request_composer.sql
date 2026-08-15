alter table public.marshall_document_requests
  add column if not exists request_message text,
  add column if not exists request_document_name text,
  add column if not exists outgoing_storage_path text,
  add column if not exists outgoing_filename text;
