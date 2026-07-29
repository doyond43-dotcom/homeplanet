create table if not exists public.cow_town_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  ranch_or_business text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),
  source text not null default 'cow-town-tags',
  created_at timestamptz not null default now()
);

alter table public.cow_town_inquiries enable row level security;

revoke all on public.cow_town_inquiries from anon, authenticated;

create or replace function public.submit_cow_town_inquiry(
  p_name text,
  p_contact text,
  p_ranch_or_business text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if char_length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'Please enter your name.';
  end if;

  if char_length(trim(coalesce(p_contact, ''))) < 5 then
    raise exception 'Please enter a phone number or email.';
  end if;

  if char_length(trim(coalesce(p_message, ''))) < 5 then
    raise exception 'Please enter a message.';
  end if;

  insert into public.cow_town_inquiries (
    name,
    contact,
    ranch_or_business,
    message
  )
  values (
    trim(p_name),
    trim(p_contact),
    nullif(trim(coalesce(p_ranch_or_business, '')), ''),
    trim(p_message)
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_cow_town_inquiry(
  text,
  text,
  text,
  text
) from public;

grant execute on function public.submit_cow_town_inquiry(
  text,
  text,
  text,
  text
) to anon, authenticated;
