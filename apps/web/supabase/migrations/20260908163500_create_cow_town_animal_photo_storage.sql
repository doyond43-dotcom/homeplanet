begin;

-- ============================================================
-- COW TOWN ANIMAL PHOTO STORAGE
-- Animal-specific upload token, public finished photo.
-- ============================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'cow-town-animal-photos',
  'cow-town-animal-photos',
  true,
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

create or replace function public.cow_town_animal_photo_token_valid(
  requested_animal_id uuid,
  requested_photo_token uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.cow_town_animals
    where id = requested_animal_id
      and photo_upload_token = requested_photo_token
      and animal_status not in ('archived', 'deceased')
  );
$$;

revoke all on function public.cow_town_animal_photo_token_valid(uuid, uuid)
from public;

grant execute on function public.cow_town_animal_photo_token_valid(uuid, uuid)
to anon, authenticated;

create or replace function public.save_cow_town_animal_photo(
  requested_animal_id uuid,
  requested_photo_token uuid,
  requested_photo_path text,
  requested_photo_url text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_new_photo_token uuid;
begin
  if not public.cow_town_animal_photo_token_valid(
    requested_animal_id,
    requested_photo_token
  ) then
    raise exception 'Animal photo upload link is invalid or expired.';
  end if;

  if nullif(trim(requested_photo_path), '') is null then
    raise exception 'Photo path is required.';
  end if;

  if nullif(trim(requested_photo_url), '') is null then
    raise exception 'Photo URL is required.';
  end if;

  if requested_photo_path not like
    requested_animal_id::text || '/' ||
    requested_photo_token::text || '/customer/%'
  then
    raise exception 'Invalid Cow Town animal photo path.';
  end if;

  v_new_photo_token := gen_random_uuid();

  update public.cow_town_animals
  set
    photo_path = trim(requested_photo_path),
    photo_url = trim(requested_photo_url),
    photo_upload_token = v_new_photo_token,
    updated_at = now()
  where id = requested_animal_id
    and photo_upload_token = requested_photo_token;

  if not found then
    raise exception 'Animal photo could not be saved.';
  end if;

  return jsonb_build_object(
    'success', true,
    'animal_id', requested_animal_id,
    'photo_url', trim(requested_photo_url)
  );
end;
$$;

revoke all on function public.save_cow_town_animal_photo(
  uuid,
  uuid,
  text,
  text
) from public;

grant execute on function public.save_cow_town_animal_photo(
  uuid,
  uuid,
  text,
  text
) to anon, authenticated;

drop policy if exists "cow_town_animal_photo_upload"
on storage.objects;

create policy "cow_town_animal_photo_upload"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'cow-town-animal-photos'
  and array_length(storage.foldername(name), 1) >= 3
  and lower(coalesce(storage.extension(name), ''))
    in ('jpg', 'jpeg', 'png', 'webp', 'heic', 'heif')
  and public.cow_town_animal_photo_token_valid(
    ((storage.foldername(name))[1])::uuid,
    ((storage.foldername(name))[2])::uuid
  )
);

commit;
