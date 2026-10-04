create or replace function public.update_cow_town_ranch_info(
  requested_management_token uuid,
  requested_ranch_name text,
  requested_primary_contact_name text,
  requested_primary_phone text,
  requested_primary_email text,
  requested_recovery_phone text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ranch public.cow_town_ranches%rowtype;
begin
  if requested_management_token is null then
    raise exception 'Ranch access was not verified.';
  end if;

  if nullif(trim(requested_ranch_name), '') is null then
    raise exception 'Ranch name is required.';
  end if;

  if nullif(trim(requested_primary_contact_name), '') is null then
    raise exception 'Contact name is required.';
  end if;

  if nullif(trim(requested_primary_phone), '') is null then
    raise exception 'Phone number is required.';
  end if;

  if nullif(trim(requested_primary_email), '') is null then
    raise exception 'Email is required.';
  end if;

  select *
  into v_ranch
  from public.cow_town_ranches
  where management_access_token = requested_management_token
    and status <> 'archived'
  limit 1;

  if not found then
    raise exception 'Ranch access was not verified.';
  end if;

  update public.cow_town_ranches
  set
    ranch_name = trim(requested_ranch_name),
    primary_contact_name = trim(requested_primary_contact_name),
    primary_phone = trim(requested_primary_phone),
    primary_email = trim(requested_primary_email),
    recovery_phone = nullif(trim(requested_recovery_phone), ''),
    updated_at = now()
  where id = v_ranch.id;

  return jsonb_build_object(
    'success', true,
    'ranch_id', v_ranch.id
  );
end;
$$;

revoke all on function public.update_cow_town_ranch_info(
  uuid,
  text,
  text,
  text,
  text,
  text
)
from public;

grant execute on function public.update_cow_town_ranch_info(
  uuid,
  text,
  text,
  text,
  text,
  text
)
to anon, authenticated;