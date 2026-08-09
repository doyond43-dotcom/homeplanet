alter table public.performance_powerboat_projects
add column if not exists customer_access_token uuid not null default gen_random_uuid();

create unique index if not exists performance_powerboat_projects_customer_access_token_idx
on public.performance_powerboat_projects(customer_access_token);

insert into storage.buckets (id, name, public)
values ('performance-powerboat-photos', 'performance-powerboat-photos', true)
on conflict (id) do update set public = true;

create or replace function public.get_performance_powerboat_customer_project(
  p_project_id uuid,
  p_token uuid
)
returns table (
  id uuid,
  project_type text,
  customer_name text,
  boat_year text,
  boat_make_model text,
  boat_length text,
  boat_engines text,
  current_milestone text,
  waiting_on text,
  proof_photos jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.project_type,
    p.customer_name,
    p.boat_year,
    p.boat_make_model,
    p.boat_length,
    p.boat_engines,
    p.current_milestone,
    p.waiting_on,
    p.proof_photos
  from public.performance_powerboat_projects p
  where p.id = p_project_id
    and p.customer_access_token = p_token
  limit 1;
$$;

grant execute on function public.get_performance_powerboat_customer_project(uuid, uuid)
to anon, authenticated;

create or replace function public.performance_powerboat_photo_token_valid(
  p_project_id uuid,
  p_token uuid
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.performance_powerboat_projects p
    where p.id = p_project_id
      and p.customer_access_token = p_token
  );
$$;

grant execute on function public.performance_powerboat_photo_token_valid(uuid, uuid)
to anon, authenticated;

create or replace function public.add_performance_powerboat_customer_photos(
  p_project_id uuid,
  p_token uuid,
  p_photos jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if not exists (
    select 1
    from public.performance_powerboat_projects
    where id = p_project_id
      and customer_access_token = p_token
  ) then
    return false;
  end if;

  v_count := jsonb_array_length(coalesce(p_photos, '[]'::jsonb));

  update public.performance_powerboat_projects
  set
    proof_photos = coalesce(proof_photos, '[]'::jsonb) || coalesce(p_photos, '[]'::jsonb),
    timeline = coalesce(timeline, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'at', now(),
        'label',
        'Customer added ' || v_count || ' photo' ||
        case when v_count = 1 then '' else 's' end
      )
    ),
    waiting_on = null,
    current_milestone = 'Reviewing Project',
    next_action = 'Review customer photos and decide next step',
    updated_at = now()
  where id = p_project_id;

  return true;
end;
$$;

grant execute on function public.add_performance_powerboat_customer_photos(uuid, uuid, jsonb)
to anon, authenticated;

drop policy if exists "performance_powerboat_public_project_read"
on public.performance_powerboat_projects;

drop policy if exists "performance_powerboat_public_project_photo_update"
on public.performance_powerboat_projects;

drop policy if exists "performance_powerboat_public_photo_upload"
on storage.objects;

create policy "performance_powerboat_public_photo_upload"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'performance-powerboat-photos'
  and array_length(storage.foldername(name), 1) >= 2
  and public.performance_powerboat_photo_token_valid(
    ((storage.foldername(name))[1])::uuid,
    ((storage.foldername(name))[2])::uuid
  )
);

drop policy if exists "performance_powerboat_public_photo_read"
on storage.objects;

create policy "performance_powerboat_public_photo_read"
on storage.objects
for select
to authenticated
using (bucket_id = 'performance-powerboat-photos');
