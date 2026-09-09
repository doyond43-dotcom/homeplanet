create or replace function public.submit_cow_town_sighting(
  requested_cow_town_id text,
  requested_location text,
  requested_condition text default null,
  requested_notes text default null,
  requested_finder_phone text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_animal public.cow_town_animals%rowtype;
  v_order_id uuid;
  v_location text := trim(coalesce(requested_location, ''));
  v_condition text := nullif(trim(coalesce(requested_condition, '')), '');
  v_notes text := nullif(trim(coalesce(requested_notes, '')), '');
  v_phone text := nullif(trim(coalesce(requested_finder_phone, '')), '');
begin
  if trim(coalesce(requested_cow_town_id, '')) = '' then
    raise exception 'Cow Town ID is required.';
  end if;

  if v_location = '' then
    raise exception 'Please enter where the animal was seen.';
  end if;

  if char_length(v_location) > 500 then
    raise exception 'Location is too long.';
  end if;

  if v_condition is not null and char_length(v_condition) > 300 then
    raise exception 'Condition is too long.';
  end if;

  if v_notes is not null and char_length(v_notes) > 1500 then
    raise exception 'Notes are too long.';
  end if;

  if v_phone is not null and char_length(v_phone) > 80 then
    raise exception 'Phone number is too long.';
  end if;

  select *
  into v_animal
  from public.cow_town_animals
  where upper(cow_town_id) = upper(trim(requested_cow_town_id))
    and activation_status = 'active'
    and animal_status not in ('sold', 'transferred', 'deceased', 'archived')
  limit 1;

  if not found then
    raise exception 'Active Cow Town animal not found.';
  end if;

  if v_animal.batch_id is not null then
    select order_id
    into v_order_id
    from public.cow_town_batches
    where id = v_animal.batch_id;
  end if;

  insert into public.cow_town_activity (
    ranch_id,
    order_id,
    batch_id,
    animal_id,
    activity_type,
    title,
    detail,
    metadata
  )
  values (
    v_animal.ranch_id,
    v_order_id,
    v_animal.batch_id,
    v_animal.id,
    'sighting_reported',
    'Public sighting reported',
    'A public finder reported ' ||
      v_animal.cow_town_id ||
      ' at ' ||
      v_location ||
      case
        when v_condition is not null then '. Condition: ' || v_condition
        else ''
      end ||
      case
        when v_notes is not null then '. Notes: ' || v_notes
        else ''
      end,
    jsonb_strip_nulls(
      jsonb_build_object(
        'cow_town_id', v_animal.cow_town_id,
        'visible_tag_number', v_animal.visible_tag_number,
        'location', v_location,
        'condition', v_condition,
        'notes', v_notes,
        'finder_phone', v_phone,
        'source', 'public_tag_page'
      )
    )
  );

  return jsonb_build_object(
    'success', true,
    'cow_town_id', v_animal.cow_town_id
  );
end;
$$;

revoke all on function public.submit_cow_town_sighting(text, text, text, text, text)
from public;

grant execute on function public.submit_cow_town_sighting(text, text, text, text, text)
to anon, authenticated;
