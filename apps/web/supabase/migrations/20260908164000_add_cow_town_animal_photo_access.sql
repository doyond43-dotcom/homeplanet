begin;

create or replace function public.get_cow_town_animal_photo_upload(
  requested_access_token uuid,
  requested_animal_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_animal public.cow_town_animals;
begin
  select a.*
  into v_animal
  from public.cow_town_animals a
  join public.cow_town_orders o
    on o.ranch_id = a.ranch_id
  where a.id = requested_animal_id
    and o.customer_access_token = requested_access_token
    and exists (
      select 1
      from public.cow_town_batches b
      where b.id = a.batch_id
        and b.order_id = o.id
    )
  limit 1;

  if not found then
    raise exception 'Cow Town animal photo access was not found.';
  end if;

  return jsonb_build_object(
    'animal_id', v_animal.id,
    'photo_upload_token', v_animal.photo_upload_token,
    'photo_url', v_animal.photo_url
  );
end;
$$;

revoke all on function public.get_cow_town_animal_photo_upload(uuid, uuid)
from public;

grant execute on function public.get_cow_town_animal_photo_upload(uuid, uuid)
to anon, authenticated;

commit;
