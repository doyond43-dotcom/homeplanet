drop policy if exists "performance_powerboat_public_insert" on public.performance_powerboat_projects;

create or replace function public.submit_performance_powerboat_project(
  p_project_type text, p_customer_name text, p_customer_phone text,
  p_customer_email text default null, p_boat_year text default null,
  p_boat_make_model text default null, p_boat_length text default null,
  p_boat_engines text default null, p_boat_location text default null,
  p_customer_request text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if p_project_type not in ('New Build', 'Boat Repair', 'Restoration & Refit', 'Marine Service') then
    raise exception 'Invalid project type';
  end if;
  if nullif(btrim(p_customer_name), '') is null or nullif(btrim(p_customer_phone), '') is null then
    raise exception 'Name and phone are required';
  end if;

  insert into public.performance_powerboat_projects (
    project_type, customer_name, customer_phone, customer_email, boat_year,
    boat_make_model, boat_length, boat_engines, boat_location, customer_request, timeline
  ) values (
    p_project_type, btrim(p_customer_name), btrim(p_customer_phone), nullif(btrim(p_customer_email), ''),
    nullif(btrim(p_boat_year), ''), nullif(btrim(p_boat_make_model), ''),
    nullif(btrim(p_boat_length), ''), nullif(btrim(p_boat_engines), ''),
    nullif(btrim(p_boat_location), ''), nullif(btrim(p_customer_request), ''),
    jsonb_build_array(jsonb_build_object('at', now(), 'label', 'Customer submitted project request'))
  ) returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.submit_performance_powerboat_project(text,text,text,text,text,text,text,text,text,text) from public;
grant execute on function public.submit_performance_powerboat_project(text,text,text,text,text,text,text,text,text,text) to anon, authenticated;

revoke all on function public.get_performance_powerboat_customer_project(uuid,uuid) from public;
revoke all on function public.performance_powerboat_photo_token_valid(uuid,uuid) from public;
revoke all on function public.add_performance_powerboat_customer_photos(uuid,uuid,jsonb) from public;
grant execute on function public.get_performance_powerboat_customer_project(uuid,uuid) to anon, authenticated;
grant execute on function public.performance_powerboat_photo_token_valid(uuid,uuid) to anon, authenticated;

create or replace function public.add_performance_powerboat_customer_photos(
  p_project_id uuid, p_token uuid, p_photos jsonb
)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_count integer;
begin
  if not exists (select 1 from public.performance_powerboat_projects where id = p_project_id and customer_access_token = p_token) then
    return false;
  end if;
  if jsonb_typeof(p_photos) <> 'array' then raise exception 'Photos must be an array'; end if;
  v_count := jsonb_array_length(p_photos);
  if v_count < 1 or v_count > 10 then raise exception 'Upload between 1 and 10 photos'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_photos) photo
    where coalesce(photo->>'path', '') not like p_project_id::text || '/' || p_token::text || '/customer/%'
  ) then raise exception 'Invalid photo path'; end if;

  update public.performance_powerboat_projects set
    proof_photos = coalesce(proof_photos, '[]'::jsonb) || p_photos,
    timeline = coalesce(timeline, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object('at', now(), 'label', 'Customer added ' || v_count || ' photo' || case when v_count = 1 then '' else 's' end)
    ), waiting_on = null, current_milestone = 'Reviewing Project',
    next_action = 'Review customer photos and decide next step', updated_at = now()
  where id = p_project_id;
  return true;
end;
$$;

revoke all on function public.add_performance_powerboat_customer_photos(uuid,uuid,jsonb) from public;
grant execute on function public.add_performance_powerboat_customer_photos(uuid,uuid,jsonb) to anon, authenticated;

drop policy if exists "performance_powerboat_public_photo_upload" on storage.objects;
create policy "performance_powerboat_public_photo_upload" on storage.objects for insert to anon, authenticated
with check (
  bucket_id = 'performance-powerboat-photos'
  and array_length(storage.foldername(name), 1) >= 3
  and lower(coalesce(storage.extension(name), '')) in ('jpg','jpeg','png','webp','gif','heic','heif')
  and public.performance_powerboat_photo_token_valid(((storage.foldername(name))[1])::uuid, ((storage.foldername(name))[2])::uuid)
);

drop policy if exists "performance_powerboat_public_photo_read" on storage.objects;
drop policy if exists "performance_powerboat_authenticated_photo_read" on storage.objects;
create policy "performance_powerboat_authenticated_photo_read" on storage.objects for select to authenticated
using (bucket_id = 'performance-powerboat-photos');
