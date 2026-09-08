begin;

-- ============================================================
-- COW TOWN ANIMAL SETUP
-- Secure order-token based animal registration.
-- ============================================================

-- Global Cow Town ID sequence.
create sequence if not exists public.cow_town_animal_id_seq
  as bigint
  minvalue 1
  start with 1;

-- Initialize the sequence from the highest real CT-#### animal already stored.
do $$
declare
  v_highest bigint;
begin
  select coalesce(
    max(
      case
        when cow_town_id ~ '^CT-[0-9]+$'
          then substring(cow_town_id from 4)::bigint
        else null
      end
    ),
    0
  )
  into v_highest
  from public.cow_town_animals;

  if v_highest > 0 then
    perform setval(
      'public.cow_town_animal_id_seq',
      v_highest,
      true
    );
  end if;
end;
$$;

create or replace function public.create_cow_town_animal_setup(
  requested_access_token uuid,
  requested_visible_tag_number text,
  requested_name text default null,
  requested_breed text default null,
  requested_sex text default null,
  requested_color text default null,
  requested_birth_year integer default null,
  requested_pasture_name text default null,
  requested_herd_group text default null,
  requested_notes text default null,
  requested_product_type text default 'full-tag'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.cow_town_orders;
  v_batch public.cow_town_batches;

  v_animal_id uuid;
  v_cow_town_id text;
  v_visible_tag_number text;
  v_product_type text;

  v_allowed_quantity integer;
  v_existing_quantity integer;
  v_qr_destination text;
begin
  if requested_access_token is null then
    raise exception 'Order access token is required.';
  end if;

  v_visible_tag_number :=
    nullif(trim(requested_visible_tag_number), '');

  if v_visible_tag_number is null then
    raise exception 'Animal or visible tag number is required.';
  end if;

  v_product_type :=
    lower(coalesce(nullif(trim(requested_product_type), ''), 'full-tag'));

  if v_product_type not in ('full-tag', 'sticker-upgrade') then
    raise exception 'Invalid Cow Town tag product type.';
  end if;

  select *
  into v_order
  from public.cow_town_orders
  where customer_access_token = requested_access_token
  for update;

  if not found then
    raise exception 'Cow Town order was not found.';
  end if;

  if v_order.status not in ('payment_verified', 'paid') then
    raise exception 'This Cow Town order is not ready for animal setup.';
  end if;

  select *
  into v_batch
  from public.cow_town_batches
  where order_id = v_order.id
  order by created_at asc
  limit 1
  for update;

  if not found then
    raise exception 'Cow Town batch was not found.';
  end if;

  v_allowed_quantity :=
    case v_product_type
      when 'full-tag' then v_order.full_tag_quantity
      when 'sticker-upgrade' then v_order.sticker_quantity
      else 0
    end;

  select count(*)
  into v_existing_quantity
  from public.cow_town_tag_assignments
  where batch_id = v_batch.id
    and product_type = v_product_type
    and production_status <> 'retired';

  if v_existing_quantity >= v_allowed_quantity then
    raise exception 'All purchased % assignments for this order are already in use.',
      v_product_type;
  end if;

  if exists (
    select 1
    from public.cow_town_animals
    where ranch_id = v_order.ranch_id
      and upper(trim(visible_tag_number)) = upper(v_visible_tag_number)
      and animal_status not in ('archived', 'transferred', 'deceased')
  ) then
    raise exception 'That animal/tag number is already active for this ranch.';
  end if;

  v_cow_town_id :=
    'CT-' ||
    lpad(
      nextval('public.cow_town_animal_id_seq')::text,
      4,
      '0'
    );

  v_qr_destination :=
    'https://okeechobeetogether.org/planet/cow-town-tags/tag/' ||
    v_cow_town_id;

  insert into public.cow_town_animals (
    ranch_id,
    batch_id,
    cow_town_id,
    visible_tag_number,
    name,
    breed,
    sex,
    color,
    birth_year,
    pasture_name,
    herd_group,
    notes,
    animal_status,
    activation_status
  )
  values (
    v_order.ranch_id,
    v_batch.id,
    v_cow_town_id,
    v_visible_tag_number,
    nullif(trim(requested_name), ''),
    nullif(trim(requested_breed), ''),
    nullif(trim(requested_sex), ''),
    nullif(trim(requested_color), ''),
    requested_birth_year,
    nullif(trim(requested_pasture_name), ''),
    nullif(trim(requested_herd_group), ''),
    nullif(trim(requested_notes), ''),
    'active',
    'active'
  )
  returning id into v_animal_id;

  insert into public.cow_town_tag_assignments (
    ranch_id,
    batch_id,
    animal_id,
    cow_town_id,
    visible_tag_number,
    product_type,
    qr_destination,
    production_status
  )
  values (
    v_order.ranch_id,
    v_batch.id,
    v_animal_id,
    v_cow_town_id,
    v_visible_tag_number,
    v_product_type,
    v_qr_destination,
    'ready'
  );

  insert into public.cow_town_animal_ownership (
    animal_id,
    ranch_id,
    acquisition_method,
    is_current
  )
  values (
    v_animal_id,
    v_order.ranch_id,
    'initial-registration',
    true
  );

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
    v_order.ranch_id,
    v_order.id,
    v_batch.id,
    v_animal_id,
    'animal_registered',
    'Animal added to Cow Town',
    coalesce(
      nullif(trim(requested_name), ''),
      'Animal ' || v_visible_tag_number
    ) || ' was connected to ' || v_cow_town_id || '.',
    jsonb_build_object(
      'cow_town_id', v_cow_town_id,
      'visible_tag_number', v_visible_tag_number,
      'product_type', v_product_type,
      'qr_destination', v_qr_destination
    )
  );

  return jsonb_build_object(
    'success', true,
    'animal_id', v_animal_id,
    'cow_town_id', v_cow_town_id,
    'visible_tag_number', v_visible_tag_number,
    'ranch_id', v_order.ranch_id,
    'batch_id', v_batch.id,
    'order_id', v_order.id,
    'product_type', v_product_type,
    'qr_destination', v_qr_destination,
    'live_url', v_qr_destination
  );
end;
$$;

revoke all on function public.create_cow_town_animal_setup(
  uuid,
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
) from public;

grant execute on function public.create_cow_town_animal_setup(
  uuid,
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
) to anon, authenticated;

commit;
