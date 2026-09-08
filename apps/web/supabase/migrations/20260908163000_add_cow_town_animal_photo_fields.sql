begin;

alter table public.cow_town_animals
  add column if not exists photo_url text,
  add column if not exists photo_path text,
  add column if not exists photo_upload_token uuid not null default gen_random_uuid();

commit;
