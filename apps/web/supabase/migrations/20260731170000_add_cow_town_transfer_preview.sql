begin;

create or replace function public.get_cow_town_ownership_transfer(
  requested_acceptance_token uuid
)
returns jsonb
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'transfer_id', transfer.id,
    'status', transfer.status,
    'transfer_method', transfer.transfer_method,
    'auction_name', transfer.auction_name,
    'auction_lot_number', transfer.auction_lot_number,
    'buyer_ranch_name', transfer.buyer_ranch_name,
    'buyer_contact_name', transfer.buyer_contact_name,
    'expires_at', transfer.expires_at,
    'initiated_at', transfer.initiated_at,

    'animal', jsonb_build_object(
      'cow_town_id', animal.cow_town_id,
      'visible_tag_number', animal.visible_tag_number,
      'name', animal.name,
      'breed', animal.breed,
      'sex', animal.sex,
      'color', animal.color
    ),

    'current_ranch', jsonb_build_object(
      'ranch_name', ranch.ranch_name
    )
  )
  from public.cow_town_ownership_transfers transfer
  join public.cow_town_animals animal
    on animal.id = transfer.animal_id
  join public.cow_town_ranches ranch
    on ranch.id = transfer.from_ranch_id
  where transfer.acceptance_token = requested_acceptance_token
  limit 1;
$$;

revoke all on function public.get_cow_town_ownership_transfer(uuid)
  from public;

grant execute on function public.get_cow_town_ownership_transfer(uuid)
  to anon, authenticated;

commit;
