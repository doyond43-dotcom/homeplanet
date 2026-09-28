create or replace function public.save_premier_customer_contact(
  p_access_token uuid,
  p_job_id uuid,
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_email text,
  p_project_address text
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

  if nullif(btrim(coalesce(p_first_name, '')), '') is null then
    raise exception 'First name is required';
  end if;

  if nullif(btrim(coalesce(p_last_name, '')), '') is null then
    raise exception 'Last name is required';
  end if;

  if nullif(btrim(coalesce(p_phone, '')), '') is null then
    raise exception 'Phone number is required';
  end if;

  if nullif(btrim(coalesce(p_project_address, '')), '') is null then
    raise exception 'Project address is required';
  end if;

  update public.premier_jobs
  set
    first_name = btrim(p_first_name),
    last_name = btrim(p_last_name),
    phone = btrim(p_phone),
    email = nullif(btrim(coalesce(p_email, '')), ''),
    project_address = btrim(p_project_address),
    updated_at = now()
  where id = p_job_id;

  return found;
end;
$$;