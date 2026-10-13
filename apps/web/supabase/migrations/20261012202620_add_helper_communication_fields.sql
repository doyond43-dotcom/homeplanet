alter table public.okeechobee_project_helpers
add column if not exists last_contact_at timestamptz;

alter table public.okeechobee_project_helpers
add column if not exists communication_note text;