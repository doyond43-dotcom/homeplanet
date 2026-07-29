begin;

create extension if not exists pgcrypto;

create table if not exists public.cow_town_ranches (
  id uuid primary key default gen_random_uuid(),
  ranch_name text not null,
  primary_contact_name text not null,
  primary_phone text not null,
  primary_email text not null,
  recovery_phone text,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cow_town_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_access_token uuid not null unique default gen_random_uuid(),

  ranch_id uuid not null references public.cow_town_ranches(id) on delete restrict,

  plan_id text not null
    check (
      plan_id in (
        'homestead',
        'small-herd',
        'working-ranch',
        'large-ranch',
        'ranch-pro',
        'enterprise'
      )
    ),

  active_animal_limit integer,
  monthly_plan_amount numeric(10,2),

  full_tag_quantity integer not null default 0
    check (full_tag_quantity >= 0),

  sticker_quantity integer not null default 0
    check (sticker_quantity >= 0),

  batch_method text not null
    check (
      batch_method in (
        'sequence',
        'enter-now',
        'upload-later'
      )
    ),

  starting_number text,
  ending_number text,
  submitted_animal_numbers jsonb not null default '[]'::jsonb,

  shipping_address text not null,
  shipping_city text not null,
  shipping_state text not null,
  shipping_zip text not null,
  shipping_notes text,

  merchandise_total numeric(10,2) not null,
  shipping_amount numeric(10,2) not null,
  one_time_total numeric(10,2) not null,

  currency text not null default 'USD',

  status text not null default 'pending_payment'
    check (
      status in (
        'pending_payment',
        'payment_processing',
        'payment_submitted',
        'payment_verified',
        'batch_setup',
        'in_production',
        'qr_verification',
        'activated',
        'ready_to_ship',
        'shipped',
        'delivered',
        'completed',
        'cancelled',
        'problem_detected'
      )
    ),

  payment_provider text,
  payment_provider_order_id text,
  payment_provider_capture_id text,

  shipping_carrier text,
  tracking_number text,
  tracking_url text,
  estimated_delivery date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cow_town_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.cow_town_orders(id) on delete cascade,

  product_type text not null
    check (product_type in ('full-tag', 'sticker-upgrade')),

  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  line_total numeric(10,2) not null,

  created_at timestamptz not null default now()
);

create table if not exists public.cow_town_batches (
  id uuid primary key default gen_random_uuid(),
  batch_number text not null unique,
  ranch_id uuid not null references public.cow_town_ranches(id) on delete restrict,
  order_id uuid not null references public.cow_town_orders(id) on delete restrict,

  batch_method text not null
    check (
      batch_method in (
        'sequence',
        'enter-now',
        'upload-later'
      )
    ),

  expected_assignment_count integer not null check (expected_assignment_count > 0),
  starting_number text,
  ending_number text,

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'awaiting_animal_numbers',
        'ready_for_production',
        'in_production',
        'ready_for_verification',
        'qr_verified',
        'activated',
        'ready_to_ship',
        'shipped',
        'completed',
        'problem_detected'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cow_town_animals (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.cow_town_ranches(id) on delete restrict,
  batch_id uuid references public.cow_town_batches(id) on delete set null,

  cow_town_id text not null unique,
  visible_tag_number text not null,

  name text,
  breed text,
  sex text,
  color text,
  birth_year integer,
  pasture_name text,
  herd_group text,
  notes text,

  animal_status text not null default 'active'
    check (
      animal_status in (
        'draft',
        'active',
        'missing',
        'found',
        'sold',
        'transferred',
        'deceased',
        'archived'
      )
    ),

  activation_status text not null default 'pending'
    check (
      activation_status in (
        'pending',
        'ready',
        'active',
        'paused',
        'retired'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cow_town_tag_assignments (
  id uuid primary key default gen_random_uuid(),
  ranch_id uuid not null references public.cow_town_ranches(id) on delete restrict,
  batch_id uuid not null references public.cow_town_batches(id) on delete restrict,
  animal_id uuid references public.cow_town_animals(id) on delete set null,

  cow_town_id text not null unique,
  visible_tag_number text not null,

  product_type text not null
    check (product_type in ('full-tag', 'sticker-upgrade')),

  qr_destination text not null,

  production_status text not null default 'pending'
    check (
      production_status in (
        'pending',
        'ready',
        'in_production',
        'printed_or_marked',
        'qr_verified',
        'activated',
        'shipped',
        'retired',
        'problem_detected'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cow_town_activity (
  id bigint generated always as identity primary key,
  ranch_id uuid references public.cow_town_ranches(id) on delete cascade,
  order_id uuid references public.cow_town_orders(id) on delete cascade,
  batch_id uuid references public.cow_town_batches(id) on delete cascade,
  animal_id uuid references public.cow_town_animals(id) on delete cascade,

  activity_type text not null,
  title text not null,
  detail text,
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists cow_town_orders_ranch_id_idx
  on public.cow_town_orders(ranch_id);

create index if not exists cow_town_orders_status_idx
  on public.cow_town_orders(status);

create index if not exists cow_town_batches_ranch_id_idx
  on public.cow_town_batches(ranch_id);

create index if not exists cow_town_batches_order_id_idx
  on public.cow_town_batches(order_id);

create index if not exists cow_town_animals_ranch_id_idx
  on public.cow_town_animals(ranch_id);

create index if not exists cow_town_animals_visible_tag_number_idx
  on public.cow_town_animals(visible_tag_number);

create index if not exists cow_town_animals_status_idx
  on public.cow_town_animals(animal_status);

create index if not exists cow_town_activity_ranch_id_idx
  on public.cow_town_activity(ranch_id);

alter table public.cow_town_ranches enable row level security;
alter table public.cow_town_orders enable row level security;
alter table public.cow_town_order_items enable row level security;
alter table public.cow_town_batches enable row level security;
alter table public.cow_town_animals enable row level security;
alter table public.cow_town_tag_assignments enable row level security;
alter table public.cow_town_activity enable row level security;

revoke all on public.cow_town_ranches from anon, authenticated;
revoke all on public.cow_town_orders from anon, authenticated;
revoke all on public.cow_town_order_items from anon, authenticated;
revoke all on public.cow_town_batches from anon, authenticated;
revoke all on public.cow_town_animals from anon, authenticated;
revoke all on public.cow_town_tag_assignments from anon, authenticated;
revoke all on public.cow_town_activity from anon, authenticated;

create or replace function public.create_cow_town_order(
  requested_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_plan_id text;
  v_plan_limit integer;
  v_monthly_amount numeric(10,2);

  v_full_tag_quantity integer;
  v_sticker_quantity integer;
  v_total_quantity integer;

  v_full_tag_unit_price numeric(10,2) := 14.99;
  v_sticker_unit_price numeric(10,2) := 7.99;

  v_merchandise_total numeric(10,2);
  v_shipping_amount numeric(10,2);
  v_one_time_total numeric(10,2);

  v_batch_method text;
  v_starting_number text;
  v_ending_number text;
  v_animal_numbers jsonb;

  v_ranch_id uuid;
  v_order_id uuid;
  v_batch_id uuid;
  v_access_token uuid;

  v_order_number text;
  v_batch_number text;

  v_ranch_name text;
  v_contact_name text;
  v_phone text;
  v_email text;
  v_recovery_phone text;

  v_shipping_address text;
  v_shipping_city text;
  v_shipping_state text;
  v_shipping_zip text;
  v_shipping_notes text;
begin
  if requested_payload is null then
    raise exception 'Order information is required.';
  end if;

  v_plan_id := nullif(trim(requested_payload ->> 'plan_id'), '');

  select plan_limit, monthly_amount
  into v_plan_limit, v_monthly_amount
  from (
    values
      ('homestead'::text, 25::integer, 9.99::numeric),
      ('small-herd', 100, 19.99),
      ('working-ranch', 300, 39.99),
      ('large-ranch', 750, 69.99),
      ('ranch-pro', 1500, 99.99),
      ('enterprise', null::integer, null::numeric)
  ) as plans(plan_id, plan_limit, monthly_amount)
  where plans.plan_id = v_plan_id;

  if not found then
    raise exception 'Choose a valid Cow Town ranch plan.';
  end if;

  v_full_tag_quantity :=
    greatest(coalesce((requested_payload ->> 'full_tag_quantity')::integer, 0), 0);

  v_sticker_quantity :=
    greatest(coalesce((requested_payload ->> 'sticker_quantity')::integer, 0), 0);

  v_total_quantity := v_full_tag_quantity + v_sticker_quantity;

  if v_total_quantity < 1 then
    raise exception 'Add at least one Cow Town tag or sticker upgrade.';
  end if;

  if v_plan_limit is not null and v_total_quantity > v_plan_limit then
    raise exception
      'This first batch exceeds the active-animal limit for the selected plan.';
  end if;

  v_batch_method := nullif(trim(requested_payload ->> 'batch_method'), '');

  if v_batch_method not in ('sequence', 'enter-now', 'upload-later') then
    raise exception 'Choose a valid first-batch setup method.';
  end if;

  v_starting_number := nullif(trim(requested_payload ->> 'starting_number'), '');
  v_ending_number := nullif(trim(requested_payload ->> 'ending_number'), '');
  v_animal_numbers :=
    coalesce(requested_payload -> 'animal_numbers', '[]'::jsonb);

  if jsonb_typeof(v_animal_numbers) <> 'array' then
    raise exception 'Animal numbers must be submitted as a list.';
  end if;

  if v_batch_method = 'sequence'
     and (v_starting_number is null or v_ending_number is null) then
    raise exception 'Starting and ending numbers are required for a sequence.';
  end if;

  if v_batch_method = 'enter-now'
     and jsonb_array_length(v_animal_numbers) <> v_total_quantity then
    raise exception
      'The number of entered animal numbers must match the product quantity.';
  end if;

  v_ranch_name := nullif(trim(requested_payload ->> 'ranch_name'), '');
  v_contact_name := nullif(trim(requested_payload ->> 'contact_name'), '');
  v_phone := nullif(trim(requested_payload ->> 'phone'), '');
  v_email := lower(nullif(trim(requested_payload ->> 'email'), ''));
  v_recovery_phone := nullif(trim(requested_payload ->> 'recovery_phone'), '');

  if v_ranch_name is null
     or v_contact_name is null
     or v_phone is null
     or v_email is null then
    raise exception 'Complete the ranch name, contact, phone, and email.';
  end if;

  v_shipping_address :=
    nullif(trim(requested_payload ->> 'shipping_address'), '');

  v_shipping_city :=
    nullif(trim(requested_payload ->> 'shipping_city'), '');

  v_shipping_state :=
    upper(nullif(trim(requested_payload ->> 'shipping_state'), ''));

  v_shipping_zip :=
    nullif(trim(requested_payload ->> 'shipping_zip'), '');

  v_shipping_notes :=
    nullif(trim(requested_payload ->> 'shipping_notes'), '');

  if v_shipping_address is null
     or v_shipping_city is null
     or v_shipping_state is null
     or v_shipping_zip is null then
    raise exception 'Complete the shipping address.';
  end if;

  v_merchandise_total :=
    round(
      (v_full_tag_quantity * v_full_tag_unit_price) +
      (v_sticker_quantity * v_sticker_unit_price),
      2
    );

  v_shipping_amount :=
    case
      when v_merchandise_total >= 100 then 0
      else 5.95
    end;

  v_one_time_total :=
    round(v_merchandise_total + v_shipping_amount, 2);

  v_order_number :=
    'CTO-' ||
    to_char(clock_timestamp(), 'YYYYMMDD') ||
    '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  v_batch_number :=
    'CTB-' ||
    to_char(clock_timestamp(), 'YYYYMMDD') ||
    '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.cow_town_ranches (
    ranch_name,
    primary_contact_name,
    primary_phone,
    primary_email,
    recovery_phone,
    status
  )
  values (
    v_ranch_name,
    v_contact_name,
    v_phone,
    v_email,
    v_recovery_phone,
    'draft'
  )
  returning id into v_ranch_id;

  insert into public.cow_town_orders (
    order_number,
    ranch_id,
    plan_id,
    active_animal_limit,
    monthly_plan_amount,
    full_tag_quantity,
    sticker_quantity,
    batch_method,
    starting_number,
    ending_number,
    submitted_animal_numbers,
    shipping_address,
    shipping_city,
    shipping_state,
    shipping_zip,
    shipping_notes,
    merchandise_total,
    shipping_amount,
    one_time_total,
    status
  )
  values (
    v_order_number,
    v_ranch_id,
    v_plan_id,
    v_plan_limit,
    v_monthly_amount,
    v_full_tag_quantity,
    v_sticker_quantity,
    v_batch_method,
    v_starting_number,
    v_ending_number,
    v_animal_numbers,
    v_shipping_address,
    v_shipping_city,
    v_shipping_state,
    v_shipping_zip,
    v_shipping_notes,
    v_merchandise_total,
    v_shipping_amount,
    v_one_time_total,
    'pending_payment'
  )
  returning id, customer_access_token
  into v_order_id, v_access_token;

  if v_full_tag_quantity > 0 then
    insert into public.cow_town_order_items (
      order_id,
      product_type,
      quantity,
      unit_price,
      line_total
    )
    values (
      v_order_id,
      'full-tag',
      v_full_tag_quantity,
      v_full_tag_unit_price,
      round(v_full_tag_quantity * v_full_tag_unit_price, 2)
    );
  end if;

  if v_sticker_quantity > 0 then
    insert into public.cow_town_order_items (
      order_id,
      product_type,
      quantity,
      unit_price,
      line_total
    )
    values (
      v_order_id,
      'sticker-upgrade',
      v_sticker_quantity,
      v_sticker_unit_price,
      round(v_sticker_quantity * v_sticker_unit_price, 2)
    );
  end if;

  insert into public.cow_town_batches (
    batch_number,
    ranch_id,
    order_id,
    batch_method,
    expected_assignment_count,
    starting_number,
    ending_number,
    status
  )
  values (
    v_batch_number,
    v_ranch_id,
    v_order_id,
    v_batch_method,
    v_total_quantity,
    v_starting_number,
    v_ending_number,
    case
      when v_batch_method = 'upload-later'
        then 'awaiting_animal_numbers'
      else 'draft'
    end
  )
  returning id into v_batch_id;

  insert into public.cow_town_activity (
    ranch_id,
    order_id,
    batch_id,
    activity_type,
    title,
    detail,
    metadata
  )
  values (
    v_ranch_id,
    v_order_id,
    v_batch_id,
    'order_created',
    'Cow Town order created',
    'The ranch account draft and first batch were created.',
    jsonb_build_object(
      'order_number', v_order_number,
      'batch_number', v_batch_number,
      'plan_id', v_plan_id,
      'assignment_count', v_total_quantity
    )
  );

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'customer_access_token', v_access_token,
    'ranch_id', v_ranch_id,
    'batch_id', v_batch_id,
    'batch_number', v_batch_number,
    'one_time_total', v_one_time_total,
    'monthly_plan_amount', v_monthly_amount,
    'status', 'pending_payment'
  );
end;
$$;

revoke all on function public.create_cow_town_order(jsonb) from public;
grant execute on function public.create_cow_town_order(jsonb) to anon, authenticated;

create or replace function public.get_cow_town_order_receipt(
  requested_access_token uuid
)
returns jsonb
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'order_id', o.id,
    'order_number', o.order_number,
    'status', o.status,
    'plan_id', o.plan_id,
    'active_animal_limit', o.active_animal_limit,
    'monthly_plan_amount', o.monthly_plan_amount,
    'full_tag_quantity', o.full_tag_quantity,
    'sticker_quantity', o.sticker_quantity,
    'batch_method', o.batch_method,
    'starting_number', o.starting_number,
    'ending_number', o.ending_number,
    'merchandise_total', o.merchandise_total,
    'shipping_amount', o.shipping_amount,
    'one_time_total', o.one_time_total,
    'shipping_city', o.shipping_city,
    'shipping_state', o.shipping_state,
    'shipping_carrier', o.shipping_carrier,
    'tracking_number', o.tracking_number,
    'tracking_url', o.tracking_url,
    'estimated_delivery', o.estimated_delivery,
    'created_at', o.created_at,

    'ranch', jsonb_build_object(
      'id', r.id,
      'name', r.ranch_name,
      'contact_name', r.primary_contact_name,
      'email', r.primary_email
    ),

    'batch', jsonb_build_object(
      'id', b.id,
      'batch_number', b.batch_number,
      'status', b.status,
      'expected_assignment_count', b.expected_assignment_count
    )
  )
  from public.cow_town_orders o
  join public.cow_town_ranches r
    on r.id = o.ranch_id
  join public.cow_town_batches b
    on b.order_id = o.id
  where o.customer_access_token = requested_access_token
  limit 1;
$$;

revoke all on function public.get_cow_town_order_receipt(uuid) from public;
grant execute on function public.get_cow_town_order_receipt(uuid) to anon, authenticated;

commit;
