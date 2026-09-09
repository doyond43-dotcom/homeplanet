create or replace function public.get_cow_town_ranch_board(
  requested_management_token uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ranch public.cow_town_ranches%rowtype;
  v_animals jsonb := '[]'::jsonb;
  v_sightings jsonb := '[]'::jsonb;
begin
  if requested_management_token is null then
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

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', animal.id,
        'cow_town_id', animal.cow_town_id,
        'visible_tag_number', animal.visible_tag_number,
        'name', animal.name,
        'breed', animal.breed,
        'sex', animal.sex,
        'color', animal.color,
        'birth_year', animal.birth_year,
        'pasture_name', animal.pasture_name,
        'herd_group', animal.herd_group,
        'animal_status', animal.animal_status,
        'activation_status', animal.activation_status,
        'created_at', animal.created_at
      )
      order by animal.created_at desc
    ),
    '[]'::jsonb
  )
  into v_animals
  from public.cow_town_animals animal
  where animal.ranch_id = v_ranch.id
    and animal.animal_status <> 'archived';

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', activity.id,
        'animal_id', activity.animal_id,
        'activity_type', activity.activity_type,
        'title', activity.title,
        'detail', activity.detail,
        'cow_town_id', activity.metadata ->> 'cow_town_id',
        'visible_tag_number', activity.metadata ->> 'visible_tag_number',
        'location', activity.metadata ->> 'location',
        'condition', activity.metadata ->> 'condition',
        'notes', activity.metadata ->> 'notes',
        'finder_phone', activity.metadata ->> 'finder_phone',
        'source', activity.metadata ->> 'source',
        'created_at', activity.created_at
      )
      order by activity.created_at desc
    ),
    '[]'::jsonb
  )
  into v_sightings
  from (
    select *
    from public.cow_town_activity
    where ranch_id = v_ranch.id
      and activity_type = 'sighting_reported'
    order by created_at desc
    limit 100
  ) activity;

  return jsonb_build_object(
    'found', true,
    'ranch', jsonb_build_object(
      'id', v_ranch.id,
      'ranch_name', v_ranch.ranch_name,
      'primary_contact_name', v_ranch.primary_contact_name,
      'primary_phone', v_ranch.primary_phone,
      'primary_email', v_ranch.primary_email,
      'recovery_phone', v_ranch.recovery_phone,
      'status', v_ranch.status
    ),
    'summary', jsonb_build_object(
      'animal_count', jsonb_array_length(v_animals),
      'sighting_count', jsonb_array_length(v_sightings)
    ),
    'animals', v_animals,
    'sightings', v_sightings
  );
end;
$$;

revoke all on function public.get_cow_town_ranch_board(uuid)
from public;

grant execute on function public.get_cow_town_ranch_board(uuid)
to anon, authenticated;
