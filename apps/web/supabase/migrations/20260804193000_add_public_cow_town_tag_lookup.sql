begin;

create or replace function public.get_public_cow_town_tag(
  requested_cow_town_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'cow_town_id', animal.cow_town_id,
    'visible_tag_number', animal.visible_tag_number,
    'name', animal.name,
    'breed', animal.breed,
    'sex', animal.sex,
    'color', animal.color,
    'birth_year', animal.birth_year,
    'animal_status', animal.animal_status,
    'activation_status', animal.activation_status,
    'recovery_phone', coalesce(ranch.recovery_phone, ranch.primary_phone)
  )
  into result
  from public.cow_town_animals animal
  join public.cow_town_ranches ranch
    on ranch.id = animal.ranch_id
  where upper(animal.cow_town_id) = upper(trim(requested_cow_town_id))
    and animal.activation_status = 'active'
    and animal.animal_status in ('active', 'missing', 'found');

  if result is null then
    return jsonb_build_object('found', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'tag', result
  );
end;
$$;

revoke all on function public.get_public_cow_town_tag(text) from public;

grant execute on function public.get_public_cow_town_tag(text)
to anon, authenticated;

commit;
