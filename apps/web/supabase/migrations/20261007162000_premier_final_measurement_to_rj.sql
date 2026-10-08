create or replace function public.save_premier_final_measurement(
  p_access_token uuid,
  p_job_id uuid,
  p_status text,
  p_scheduled_for timestamptz default null,
  p_assigned_to text default null,
  p_completed_at timestamptz default null,
  p_note text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_status text := lower(coalesce(p_status, ''));
  v_assigned_to text := nullif(btrim(coalesce(p_assigned_to, '')), '');
  v_existing_scheduled timestamptz;
  v_existing_completed timestamptz;
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

  if v_status not in ('not_scheduled', 'scheduled', 'complete') then
    return false;
  end if;

  if v_assigned_to is not null
    and v_assigned_to not in ('Gino', 'Dennis', 'Gio')
  then
    return false;
  end if;

  select
    j.final_measure_scheduled_for,
    j.final_measure_completed_at
  into
    v_existing_scheduled,
    v_existing_completed
  from public.premier_jobs j
  where j.id = p_job_id
    and j.current_stage = 'proposal_approved';

  if not found then
    return false;
  end if;

  if v_status = 'scheduled'
    and p_scheduled_for is null
    and v_existing_scheduled is null
  then
    return false;
  end if;

  update public.premier_jobs j
  set
    final_measure_status = v_status,

    final_measure_scheduled_for = case
      when v_status = 'not_scheduled' then null
      else coalesce(p_scheduled_for, v_existing_scheduled)
    end,

    final_measure_assigned_to = v_assigned_to,

    final_measure_completed_at = case
      when v_status = 'complete'
        then coalesce(p_completed_at, v_existing_completed, now())
      else null
    end,

    final_measure_note =
      nullif(btrim(coalesce(p_note, '')), ''),

    current_stage = case
      when v_status = 'complete'
        then 'installation_ready'
      else j.current_stage
    end,

    next_action = case
      when v_status = 'not_scheduled'
        then 'Office to schedule final detailed measurement.'
      when v_status = 'scheduled'
        then coalesce(v_assigned_to, 'Assigned salesperson') ||
             ' to complete final detailed measurement.'
      when v_status = 'complete'
        then 'RJ to review the Final Measurement package and coordinate installation scheduling.'
    end,

    latest_sales_note = case
      when v_status = 'not_scheduled'
        then 'Final detailed measurement is not scheduled yet.'
      when v_status = 'scheduled'
        then 'Final detailed measurement scheduled for ' ||
             coalesce(v_assigned_to, 'assigned salesperson') || '.'
      when v_status = 'complete'
        then 'Final Measurement package completed and sent to RJ.'
    end,

    updated_at = now()

  where j.id = p_job_id
    and j.current_stage = 'proposal_approved';

  return found;
end;
$function$;
