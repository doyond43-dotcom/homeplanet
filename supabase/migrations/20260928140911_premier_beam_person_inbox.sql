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
  v_label text;
  v_recipient_name text;
begin
  select a.label
  into v_label
  from private.premier_staff_access a
  where a.access_token = p_access_token
    and a.is_active = true
    and (a.expires_at is null or a.expires_at > now())
  limit 1;

  if v_label is null then
    raise exception 'invalid or expired Premier staff access';
  end if;

  if v_label like 'staff:%:%' then
    v_recipient_name :=
      substring(v_label from '[^:]+$');
  else
    v_recipient_name := null;
  end if;

  if v_recipient_name is null then
    return;
  end if;

  return query
  select
    m.id,
    m.job_id,
    m.sender_label,
    m.sender_role,
    m.recipient_role,
    m.body,
    m.created_at,
    m.read_at,
    j.first_name,
    j.last_name,
    j.project_address
  from public.premier_beam_messages m
  join public.premier_jobs j
    on j.id = m.job_id
  where m.recipient_role = v_recipient_name
  order by
    (m.read_at is null) desc,
    m.created_at desc;
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
  v_label text;
  v_recipient_name text;
begin
  select a.label
  into v_label
  from private.premier_staff_access a
  where a.access_token = p_access_token
    and a.is_active = true
    and (a.expires_at is null or a.expires_at > now())
  limit 1;

  if v_label is null then
    raise exception 'invalid or expired Premier staff access';
  end if;

  if v_label like 'staff:%:%' then
    v_recipient_name :=
      substring(v_label from '[^:]+$');
  else
    return false;
  end if;

  update public.premier_beam_messages
  set read_at = coalesce(read_at, now())
  where id = p_message_id
    and recipient_role = v_recipient_name;

  return found;
end;
$$;
