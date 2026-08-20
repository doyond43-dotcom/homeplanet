alter table public.marshall_cases
  add column if not exists consultation_date date,
  add column if not exists consultation_time time,
  add column if not exists consultation_note text,
  add column if not exists consultation_completed_at timestamptz;

create or replace function public.marshall_schedule_consultation(
  p_case_id uuid,
  p_consultation_date date,
  p_consultation_time time default null,
  p_note text default null
)
returns setof public.marshall_case_truth_events
language plpgsql
security invoker
set search_path = public
as $$
declare
  clean_note text := nullif(btrim(p_note), '');
  prior_status text;
  status_event_id uuid;
  milestone_event_id uuid;
  consultation_detail text;
begin
  if p_consultation_date is null then
    raise exception 'Consultation date is required.';
  end if;

  select status into prior_status
  from public.marshall_cases
  where id = p_case_id;

  update public.marshall_cases
  set
    consultation_date = p_consultation_date,
    consultation_time = p_consultation_time,
    consultation_note = clean_note,
    consultation_completed_at = null,
    status = 'consultation_scheduled',
    updated_at = now()
  where id = p_case_id;

  if not found then
    raise exception 'Marshall case not found.';
  end if;

  if prior_status is distinct from 'consultation_scheduled' then
    select id into status_event_id
    from public.marshall_case_truth_events
    where case_id = p_case_id
      and event_type = 'status_changed'
    order by created_at desc
    limit 1;
  end if;

  consultation_detail := to_char(p_consultation_date, 'FMMonth FMDD, YYYY');
  if p_consultation_time is not null then
    consultation_detail := consultation_detail || ' at ' ||
      to_char(p_consultation_time, 'FMHH12:MI AM');
  end if;
  if clean_note is not null then
    consultation_detail := consultation_detail || E'\n' || clean_note;
  end if;

  insert into public.marshall_case_truth_events (
    case_id,
    event_type,
    event_label,
    event_detail,
    event_meta
  )
  values (
    p_case_id,
    'consultation_scheduled',
    'Consultation scheduled',
    consultation_detail,
    jsonb_build_object(
      'consultation_date', p_consultation_date,
      'consultation_time', p_consultation_time,
      'note', clean_note
    )
  )
  returning id into milestone_event_id;

  return query
  select event.*
  from public.marshall_case_truth_events event
  where event.id in (status_event_id, milestone_event_id)
  order by event.created_at asc;
end;
$$;

create or replace function public.marshall_complete_consultation(
  p_case_id uuid
)
returns setof public.marshall_case_truth_events
language plpgsql
security invoker
set search_path = public
as $$
declare
  completed_at timestamptz := now();
  milestone_event_id uuid;
begin
  update public.marshall_cases
  set
    consultation_completed_at = completed_at,
    updated_at = completed_at
  where id = p_case_id
    and consultation_date is not null;

  if not found then
    raise exception 'A scheduled consultation is required.';
  end if;

  insert into public.marshall_case_truth_events (
    case_id,
    event_type,
    event_label,
    event_detail,
    event_meta
  )
  values (
    p_case_id,
    'consultation_completed',
    'Consultation completed',
    null,
    jsonb_build_object('completed_at', completed_at)
  )
  returning id into milestone_event_id;

  return query
  select event.*
  from public.marshall_case_truth_events event
  where event.id = milestone_event_id;
end;
$$;

create or replace function public.marshall_accept_case(
  p_case_id uuid,
  p_next_step text
)
returns setof public.marshall_case_truth_events
language plpgsql
security invoker
set search_path = public
as $$
declare
  clean_next_step text := nullif(btrim(p_next_step), '');
  prior_status text;
  status_event_id uuid;
  milestone_event_id uuid;
begin
  if clean_next_step is null then
    raise exception 'Next step is required for an accepted case.';
  end if;

  select status into prior_status
  from public.marshall_cases
  where id = p_case_id;

  update public.marshall_cases
  set
    status = 'accepted',
    next_action = clean_next_step,
    updated_at = now()
  where id = p_case_id;

  if not found then
    raise exception 'Marshall case not found.';
  end if;

  if prior_status is distinct from 'accepted' then
    select id into status_event_id
    from public.marshall_case_truth_events
    where case_id = p_case_id
      and event_type = 'status_changed'
    order by created_at desc
    limit 1;
  end if;

  insert into public.marshall_case_truth_events (
    case_id,
    event_type,
    event_label,
    event_detail,
    event_meta
  )
  values (
    p_case_id,
    'case_accepted',
    'Case accepted',
    'Next step: ' || clean_next_step,
    jsonb_build_object('next_step', clean_next_step)
  )
  returning id into milestone_event_id;

  return query
  select event.*
  from public.marshall_case_truth_events event
  where event.id in (status_event_id, milestone_event_id)
  order by event.created_at asc;
end;
$$;

create or replace function public.marshall_decline_case(
  p_case_id uuid,
  p_reason text default null
)
returns setof public.marshall_case_truth_events
language plpgsql
security invoker
set search_path = public
as $$
declare
  clean_reason text := nullif(btrim(p_reason), '');
  prior_status text;
  status_event_id uuid;
  milestone_event_id uuid;
begin
  select status into prior_status
  from public.marshall_cases
  where id = p_case_id;

  update public.marshall_cases
  set
    status = 'declined',
    internal_notes = case
      when clean_reason is null then internal_notes
      else concat_ws(E'\n\n', nullif(internal_notes, ''), 'Declined: ' || clean_reason)
    end,
    updated_at = now()
  where id = p_case_id;

  if not found then
    raise exception 'Marshall case not found.';
  end if;

  if prior_status is distinct from 'declined' then
    select id into status_event_id
    from public.marshall_case_truth_events
    where case_id = p_case_id
      and event_type = 'status_changed'
    order by created_at desc
    limit 1;
  end if;

  insert into public.marshall_case_truth_events (
    case_id,
    event_type,
    event_label,
    event_detail,
    event_meta
  )
  values (
    p_case_id,
    'case_declined',
    'Case declined',
    clean_reason,
    jsonb_build_object('reason', clean_reason)
  )
  returning id into milestone_event_id;

  return query
  select event.*
  from public.marshall_case_truth_events event
  where event.id in (status_event_id, milestone_event_id)
  order by event.created_at asc;
end;
$$;

grant execute on function public.marshall_schedule_consultation(uuid, date, time, text)
to authenticated;
grant execute on function public.marshall_complete_consultation(uuid)
to authenticated;
grant execute on function public.marshall_accept_case(uuid, text)
to authenticated;
grant execute on function public.marshall_decline_case(uuid, text)
to authenticated;

revoke execute on function public.marshall_schedule_consultation(uuid, date, time, text)
from public, anon;
revoke execute on function public.marshall_complete_consultation(uuid)
from public, anon;
revoke execute on function public.marshall_accept_case(uuid, text)
from public, anon;
revoke execute on function public.marshall_decline_case(uuid, text)
from public, anon;
