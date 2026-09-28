create or replace function public.get_premier_beam_inbox(
  p_access_token uuid
)
returns table (
  id uuid,
  job_id uuid,
  sender_label text,
  sender_role text,
  recipient_role text,
  body text,
  created_at timestamptz,
  read_at timestamptz,
  first_name text,
  last_name text,
  project_address text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recipient_name text;
begin
  select m.display_name
  into v_recipient_name
  from private.premier_staff_sessions s
  join private.premier_staff_members m
    on m.id = s.staff_id
  join private.premier_staff_access a
    on a.access_token = s.access_token
  where s.access_token = p_access_token
    and m.is_active = true
    and a.is_active = true
    and (a.expires_at is null or a.expires_at > now())
  limit 1;

  if v_recipient_name is null then
    return;
  end if;

  return query
  select
    bm.id,
    bm.job_id,
    bm.sender_label,
    bm.sender_role,
    bm.recipient_role,
    bm.body,
    bm.created_at,
    bm.read_at,
    j.first_name,
    j.last_name,
    j.project_address
  from public.premier_beam_messages bm
  join public.premier_jobs j
    on j.id = bm.job_id
  where bm.recipient_role = v_recipient_name
  order by
    (bm.read_at is null) desc,
    bm.created_at desc;
end;
$$;


create or replace function public.mark_my_premier_beam_read(
  p_access_token uuid,
  p_message_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recipient_name text;
begin
  select m.display_name
  into v_recipient_name
  from private.premier_staff_sessions s
  join private.premier_staff_members m
    on m.id = s.staff_id
  join private.premier_staff_access a
    on a.access_token = s.access_token
  where s.access_token = p_access_token
    and m.is_active = true
    and a.is_active = true
    and (a.expires_at is null or a.expires_at > now())
  limit 1;

  if v_recipient_name is null then
    return false;
  end if;

  update public.premier_beam_messages
  set read_at = coalesce(read_at, now())
  where id = p_message_id
    and recipient_role = v_recipient_name;

  return found;
end;
$$;
