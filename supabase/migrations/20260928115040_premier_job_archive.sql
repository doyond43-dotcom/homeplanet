alter table public.premier_jobs
  add column if not exists is_archived boolean not null default false,
  add column if not exists archived_at timestamp with time zone;

create or replace function public.archive_premier_job(
  p_access_token uuid,
  p_job_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from private.premier_staff_access a
    where a.access_token = p_access_token
      and a.is_active = true
      and (a.expires_at is null or a.expires_at > now())
  ) then
    raise exception 'Invalid or expired Premier staff access';
  end if;

  update public.premier_jobs
  set
    is_archived = true,
    archived_at = now(),
    updated_at = now()
  where id = p_job_id
    and is_archived = false;

  return found;
end;
$$;

create or replace function public.restore_premier_job(
  p_access_token uuid,
  p_job_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from private.premier_staff_access a
    where a.access_token = p_access_token
      and a.is_active = true
      and (a.expires_at is null or a.expires_at > now())
  ) then
    raise exception 'Invalid or expired Premier staff access';
  end if;

  update public.premier_jobs
  set
    is_archived = false,
    archived_at = null,
    updated_at = now()
  where id = p_job_id
    and is_archived = true;

  return found;
end;
$$;