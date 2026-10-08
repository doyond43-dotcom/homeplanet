create or replace function public.reassign_premier_install_crew(
  p_access_token uuid,
  p_job_id uuid,
  p_crew text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if nullif(trim(coalesce(p_crew, '')), '') is null then
    return false;
  end if;

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
    crew = trim(p_crew),
    next_action = case
      when j.scheduled_for is null
        then 'Field Operations to schedule installation.'
      else 'Field Operations to prepare crew for installation.'
    end,
    latest_sales_note =
      'Field Operations assigned installation crew to ' || trim(p_crew) || '.',
    updated_at = now()
  where j.id = p_job_id
    and j.current_stage in ('installation_ready', 'scheduled');

  return found;
end;
$function$;


create or replace function public.schedule_premier_install(
  p_access_token uuid,
  p_job_id uuid,
  p_scheduled_for timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if p_scheduled_for is null then
    return false;
  end if;

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
    scheduled_for = p_scheduled_for,
    current_stage = 'scheduled',
    next_action = case
      when nullif(trim(coalesce(j.crew, '')), '') is null
        then 'Field Operations to assign installer / crew.'
      else 'Field Operations to prepare crew for installation.'
    end,
    latest_sales_note =
      'Field Operations scheduled installation for ' ||
      to_char(p_scheduled_for at time zone 'America/New_York', 'Mon DD, YYYY FMHH12:MI AM') ||
      '.',
    updated_at = now()
  where j.id = p_job_id
    and j.current_stage in ('installation_ready', 'scheduled');

  return found;
end;
$function$;
