create or replace function public.send_premier_beam_message(
  p_access_token uuid,
  p_job_id uuid,
  p_sender_role text,
  p_recipient_role text,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sender_label text;
  v_message_id uuid;
begin
  select a.label
  into v_sender_label
  from private.premier_staff_access a
  where a.access_token = p_access_token
    and a.is_active = true
    and (a.expires_at is null or a.expires_at > now())
  limit 1;

  if v_sender_label is null then
    raise exception 'invalid or expired Premier staff access';
  end if;

  if not exists (
    select 1
    from public.premier_jobs j
    where j.id = p_job_id
  ) then
    raise exception 'Premier job not found';
  end if;

  if nullif(btrim(coalesce(p_body, '')), '') is null then
    raise exception 'message cannot be blank';
  end if;

  if p_sender_role not in ('Office', 'Field Ops', 'Installer/Tech', 'Sales') then
    raise exception 'invalid sender role';
  end if;

  if p_recipient_role not in (
    'Gio Richardson',
    'Gino Marquez',
    'Dennis Dillon',
    'RJ',
    'Angel'
  ) then
    raise exception 'invalid Beam recipient';
  end if;

  insert into public.premier_beam_messages (
    job_id,
    sender_label,
    sender_role,
    recipient_role,
    body
  )
  values (
    p_job_id,
    v_sender_label,
    p_sender_role,
    p_recipient_role,
    btrim(p_body)
  )
  returning id into v_message_id;

  return v_message_id;
end;
$$;
