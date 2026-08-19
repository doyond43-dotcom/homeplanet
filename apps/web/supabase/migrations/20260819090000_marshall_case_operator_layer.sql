alter table public.marshall_cases
  add column if not exists next_follow_up_date date,
  add column if not exists next_follow_up_time time,
  add column if not exists next_follow_up_reason text;

create or replace function public.marshall_log_status_change()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  status_label text;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  status_label := case new.status
    when 'new' then 'New'
    when 'reviewing' then 'Reviewing'
    when 'need_documents' then 'Need Documents'
    when 'contacted' then 'Contacted'
    when 'consultation_scheduled' then 'Consultation Scheduled'
    when 'accepted' then 'Accepted'
    when 'declined' then 'Declined'
    when 'closed' then 'Closed'
    else initcap(replace(new.status, '_', ' '))
  end;

  insert into public.marshall_case_truth_events (
    case_id,
    event_type,
    event_label,
    event_detail,
    event_meta
  )
  values (
    new.id,
    'status_changed',
    'Status changed to ' || status_label,
    'Previous status: ' || initcap(replace(old.status, '_', ' ')),
    jsonb_build_object('from', old.status, 'to', new.status)
  );

  return new;
end;
$$;

drop trigger if exists marshall_case_status_truth_trigger
on public.marshall_cases;

create trigger marshall_case_status_truth_trigger
after update of status on public.marshall_cases
for each row
execute function public.marshall_log_status_change();

create or replace function public.marshall_add_internal_note(
  p_case_id uuid,
  p_note text
)
returns setof public.marshall_case_truth_events
language plpgsql
security invoker
set search_path = public
as $$
declare
  clean_note text := nullif(btrim(p_note), '');
  event_id uuid;
begin
  if clean_note is null then
    raise exception 'Internal note is required.';
  end if;

  update public.marshall_cases
  set
    internal_notes = concat_ws(E'\n\n', nullif(internal_notes, ''), clean_note),
    updated_at = now()
  where id = p_case_id;

  if not found then
    raise exception 'Marshall case not found.';
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
    'internal_note_added',
    'Internal note added',
    clean_note,
    '{}'::jsonb
  )
  returning id into event_id;

  return query
  select *
  from public.marshall_case_truth_events
  where id = event_id;
end;
$$;

create or replace function public.marshall_schedule_follow_up(
  p_case_id uuid,
  p_follow_up_date date,
  p_follow_up_time time default null,
  p_reason text default null
)
returns setof public.marshall_case_truth_events
language plpgsql
security invoker
set search_path = public
as $$
declare
  clean_reason text := nullif(btrim(p_reason), '');
  event_id uuid;
  follow_up_detail text;
begin
  if p_follow_up_date is null then
    raise exception 'Follow-up date is required.';
  end if;

  update public.marshall_cases
  set
    next_follow_up_date = p_follow_up_date,
    next_follow_up_time = p_follow_up_time,
    next_follow_up_reason = clean_reason,
    updated_at = now()
  where id = p_case_id;

  if not found then
    raise exception 'Marshall case not found.';
  end if;

  follow_up_detail := to_char(p_follow_up_date, 'FMMonth FMDD, YYYY');
  if p_follow_up_time is not null then
    follow_up_detail := follow_up_detail || ' at ' || to_char(p_follow_up_time, 'FMHH12:MI AM');
  end if;
  if clean_reason is not null then
    follow_up_detail := follow_up_detail || E'\n' || clean_reason;
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
    'follow_up_scheduled',
    'Follow-up scheduled',
    follow_up_detail,
    jsonb_build_object(
      'follow_up_date', p_follow_up_date,
      'follow_up_time', p_follow_up_time,
      'reason', clean_reason
    )
  )
  returning id into event_id;

  return query
  select *
  from public.marshall_case_truth_events
  where id = event_id;
end;
$$;

grant execute on function public.marshall_add_internal_note(uuid, text)
to authenticated;

grant execute on function public.marshall_schedule_follow_up(uuid, date, time, text)
to authenticated;

revoke execute on function public.marshall_add_internal_note(uuid, text)
from public, anon;

revoke execute on function public.marshall_schedule_follow_up(uuid, date, time, text)
from public, anon;
