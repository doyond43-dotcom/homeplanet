create table if not exists public.premier_beam_messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.premier_jobs(id) on delete cascade,
  sender_label text not null,
  sender_role text not null,
  recipient_role text not null,
  body text not null,
  created_at timestamp with time zone not null default now(),
  read_at timestamp with time zone
);

create index if not exists premier_beam_messages_job_created_idx
  on public.premier_beam_messages(job_id, created_at desc);

create index if not exists premier_beam_messages_recipient_unread_idx
  on public.premier_beam_messages(recipient_role, read_at)
  where read_at is null;

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

  if p_sender_role not in ('Office', 'Field Ops', 'Installer/Tech') then
    raise exception 'invalid sender role';
  end if;

  if p_recipient_role not in ('Office', 'Field Ops', 'Installer/Tech') then
    raise exception 'invalid recipient role';
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

create or replace function public.get_premier_beam_messages(
  p_access_token uuid,
  p_job_id uuid
)
returns table(
  id uuid,
  job_id uuid,
  sender_label text,
  sender_role text,
  recipient_role text,
  body text,
  created_at timestamp with time zone,
  read_at timestamp with time zone
)
language sql
security definer
set search_path = ''
as $$
  select
    m.id,
    m.job_id,
    m.sender_label,
    m.sender_role,
    m.recipient_role,
    m.body,
    m.created_at,
    m.read_at
  from public.premier_beam_messages m
  where m.job_id = p_job_id
    and exists (
      select 1
      from private.premier_staff_access a
      where a.access_token = p_access_token
        and a.is_active = true
        and (a.expires_at is null or a.expires_at > now())
    )
  order by m.created_at asc;
$$;

create or replace function public.mark_premier_beam_read(
  p_access_token uuid,
  p_job_id uuid,
  p_recipient_role text
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  if not exists (
    select 1
    from private.premier_staff_access a
    where a.access_token = p_access_token
      and a.is_active = true
      and (a.expires_at is null or a.expires_at > now())
  ) then
    raise exception 'invalid or expired Premier staff access';
  end if;

  update public.premier_beam_messages
  set read_at = now()
  where job_id = p_job_id
    and recipient_role = p_recipient_role
    and read_at is null;

  get diagnostics v_count = row_count;

  return v_count;
end;
$$;
