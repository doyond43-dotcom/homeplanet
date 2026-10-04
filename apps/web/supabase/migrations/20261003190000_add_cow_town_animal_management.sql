create or replace function public.get_cow_town_managed_animal(
  requested_management_token uuid,
  requested_cow_town_id text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ranch public.cow_town_ranches%rowtype;
  v_animal public.cow_town_animals%rowtype;
begin
  if requested_management_token is null
     or nullif(trim(requested_cow_town_id), '') is null then
    return jsonb_build_object('found', false);
  end if;

  select *
  into v_ranch
  from public.cow_town_ranches
  where management_access_token = requested_management_token
    and status <> 'archived'
  limit 1;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  select *
  into v_animal
  from public.cow_town_animals
  where ranch_id = v_ranch.id
    and upper(cow_town_id) = upper(trim(requested_cow_town_id))
    and animal_status <> 'archived'
  limit 1;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'ranch', jsonb_build_object(
      'id', v_ranch.id,
      'ranch_name', v_ranch.ranch_name
    ),
    'animal', jsonb_build_object(
      'id', v_animal.id,
      'cow_town_id', v_animal.cow_town_id,
      'visible_tag_number', v_animal.visible_tag_number,
      'name', v_animal.name,
      'breed', v_animal.breed,
      'sex', v_animal.sex,
      'color', v_animal.color,
      'birth_year', v_animal.birth_year,
      'pasture_name', v_animal.pasture_name,
      'herd_group', v_animal.herd_group,
      'notes', v_animal.notes,
      'animal_status', v_animal.animal_status,
      'activation_status', v_animal.activation_status,
      'updated_at', v_animal.updated_at
    )
  );
end;
$$;

revoke all on function public.get_cow_town_managed_animal(uuid, text)
from public;

grant execute on function public.get_cow_town_managed_animal(uuid, text)
to anon, authenticated;


create or replace function public.update_cow_town_managed_animal(
  requested_management_token uuid,
  requested_cow_town_id text,
  requested_visible_tag_number text,
  requested_name text,
  requested_breed text,
  requested_sex text,
  requested_color text,
  requested_birth_year integer,
  requested_pasture_name text,
  requested_herd_group text,
  requested_notes text,
  requested_animal_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ranch public.cow_town_ranches%rowtype;
  v_animal public.cow_town_animals%rowtype;
begin
  if requested_management_token is null then
    raise exception 'Ranch access was not verified.';
  end if;

  if nullif(trim(requested_cow_town_id), '') is null then
    raise exception 'Cow Town ID is required.';
  end if;

  if nullif(trim(requested_visible_tag_number), '') is null then
    raise exception 'Animal number is required.';
  end if;

  if requested_animal_status not in (
    'active',
    'missing',
    'found',
    'sold',
    'deceased'
  ) then
    raise exception 'Invalid animal status.';
  end if;

  if requested_birth_year is not null
     and (
       requested_birth_year < 1900
       or requested_birth_year > extract(year from now())::integer + 1
     ) then
    raise exception 'Birth year is not valid.';
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

  select *
  into v_animal
  from public.cow_town_animals
  where ranch_id = v_ranch.id
    and upper(cow_town_id) = upper(trim(requested_cow_town_id))
    and animal_status <> 'archived'
  limit 1;

  if not found then
    raise exception 'Animal not found or ranch access was not verified.';
  end if;

  update public.cow_town_animals
  set
    visible_tag_number = trim(requested_visible_tag_number),
    name = nullif(trim(requested_name), ''),
    breed = nullif(trim(requested_breed), ''),
    sex = nullif(trim(requested_sex), ''),
    color = nullif(trim(requested_color), ''),
    birth_year = requested_birth_year,
    pasture_name = nullif(trim(requested_pasture_name), ''),
    herd_group = nullif(trim(requested_herd_group), ''),
    notes = nullif(trim(requested_notes), ''),
    animal_status = requested_animal_status,
    updated_at = now()
  where id = v_animal.id;

  return jsonb_build_object(
    'success', true,
    'cow_town_id', v_animal.cow_town_id
  );
end;
$$;

revoke all on function public.update_cow_town_managed_animal(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  integer,
  text,
  text,
  text,
  text
)
from public;

grant execute on function public.update_cow_town_managed_animal(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  integer,
  text,
  text,
  text,
  text
)
to anon, authenticated;