create or replace function public.get_premier_installer_jobs(
  p_access_token uuid
)
returns table(
  id uuid,
  first_name text,
  last_name text,
  phone text,
  email text,
  project_address text,
  intake_notes text,
  crew text,
  scheduled_for timestamptz,
  material_status text,
  permit_status text,
  next_action text,
  current_stage text
)
language sql
security definer
set search_path = ''
as $function$
  select
    j.id,
    j.first_name,
    j.last_name,
    j.phone,
    j.email,
    j.project_address,
    j.intake_notes,
    j.crew,
    j.scheduled_for,
    j.material_status,
    j.permit_status,
    j.next_action,
    j.current_stage
  from public.premier_jobs j
  where j.current_stage in (
    'installation_ready',
    'scheduled',
    'installation_in_progress',
    'installer_finish_back'
  )
    and exists (
      select 1
      from private.premier_staff_access a
      where a.access_token = p_access_token
        and a.is_active = true
        and (a.expires_at is null or a.expires_at > now())
    )
  order by j.scheduled_for asc nulls last, j.updated_at desc;
$function$;

create or replace function public.start_premier_installation(
  p_access_token uuid,
  p_job_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if not exists (
    select 1
    from private.premier_staff_access a
    where a.access_token = p_access_token
      and a.is_active = true
      and (a.expires_at is null or a.expires_at > now())
  ) then
    return false;
  end if;

  update public.premier_jobs j
  set
    current_stage = 'installation_in_progress',
    status = 'active',
    next_action = 'Installer to complete installation and upload required proof.',
    latest_sales_note = 'Installer started installation.',
    updated_at = now()
  where j.id = p_job_id
    and j.current_stage in (
      'installation_ready',
      'scheduled'
    );

  return found;
end;
$function$;
