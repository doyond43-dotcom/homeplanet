-- Guardian Pet Tag fulfillment system.
-- Adds operator authorization, secure fulfillment transitions,
-- customer tracking access, shipping information, and activity history.

create extension if not exists pgcrypto;

-- ============================================================
-- APPROVED GUARDIAN OPERATORS
-- ============================================================

create table if not exists public.guardian_operators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.guardian_operators enable row level security;

drop policy if exists
  "Guardian operators may view their own operator record"
  on public.guardian_operators;

create policy
  "Guardian operators may view their own operator record"
  on public.guardian_operators
  for select
  to authenticated
  using (user_id = auth.uid());

insert into public.guardian_operators (
  user_id,
  email
)
select
  id,
  lower(email)
from auth.users
where lower(email) = 'doyond43@gmail.com'
on conflict (user_id) do update
set email = excluded.email;

create or replace function public.is_guardian_operator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.guardian_operators
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_guardian_operator()
  from public;

grant execute on function public.is_guardian_operator()
  to authenticated;

-- ============================================================
-- GUARDIAN ORDER FULFILLMENT FIELDS
-- ============================================================

alter table public.guardian_orders
  add column if not exists customer_access_token uuid
    default gen_random_uuid(),
  add column if not exists payment_verified_at timestamptz,
  add column if not exists tag_preparation_at timestamptz,
  add column if not exists tag_activated_at timestamptz,
  add column if not exists ready_to_ship_at timestamptz,
  add column if not exists shipping_carrier text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text,
  add column if not exists estimated_delivery_date date,
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists fulfillment_updated_at timestamptz
    default now();

update public.guardian_orders
set customer_access_token = gen_random_uuid()
where customer_access_token is null;

alter table public.guardian_orders
  alter column customer_access_token set not null;

create unique index if not exists
  guardian_orders_customer_access_token_key
  on public.guardian_orders(customer_access_token);

create index if not exists
  guardian_orders_status_created_at_idx
  on public.guardian_orders(status, created_at desc);

-- ============================================================
-- FULFILLMENT ACTIVITY HISTORY
-- ============================================================

create table if not exists public.guardian_order_activity (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  event_type text not null,
  title text not null,
  detail text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.guardian_order_activity enable row level security;

create index if not exists
  guardian_order_activity_order_created_idx
  on public.guardian_order_activity(order_id, created_at asc);

drop policy if exists
  "Guardian operators may view fulfillment activity"
  on public.guardian_order_activity;

create policy
  "Guardian operators may view fulfillment activity"
  on public.guardian_order_activity
  for select
  to authenticated
  using (public.is_guardian_operator());

insert into public.guardian_order_activity (
  order_id,
  event_type,
  title,
  detail
)
select
  guardian_orders.order_id,
  'order_received',
  'Order received',
  'The Pet Tag order was created.'
from public.guardian_orders
where not exists (
  select 1
  from public.guardian_order_activity
  where guardian_order_activity.order_id = guardian_orders.order_id
    and guardian_order_activity.event_type = 'order_received'
);

-- ============================================================
-- OPERATOR BOARD READ ACCESS
-- ============================================================

create or replace function public.get_guardian_fulfillment_orders()
returns setof public.guardian_orders
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_guardian_operator() then
    raise exception 'Guardian operator access required.';
  end if;

  return query
  select *
  from public.guardian_orders
  order by created_at desc;
end;
$$;

revoke all on function public.get_guardian_fulfillment_orders()
  from public;

grant execute on function public.get_guardian_fulfillment_orders()
  to authenticated;

create or replace function public.get_guardian_operator_activity(
  requested_order_id text
)
returns setof public.guardian_order_activity
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_guardian_operator() then
    raise exception 'Guardian operator access required.';
  end if;

  return query
  select *
  from public.guardian_order_activity
  where order_id = trim(requested_order_id)
  order by created_at asc;
end;
$$;

revoke all on function public.get_guardian_operator_activity(text)
  from public;

grant execute on function public.get_guardian_operator_activity(text)
  to authenticated;

-- ============================================================
-- SECURE FULFILLMENT STAGE TRANSITIONS
-- ============================================================

create or replace function public.advance_guardian_fulfillment(
  requested_order_id text,
  requested_next_status text
)
returns public.guardian_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  current_order public.guardian_orders;
  updated_order public.guardian_orders;
  event_title text;
  event_detail text;
begin
  if not public.is_guardian_operator() then
    raise exception 'Guardian operator access required.';
  end if;

  select *
  into current_order
  from public.guardian_orders
  where order_id = trim(requested_order_id)
  for update;

  if not found then
    raise exception 'Guardian order not found.';
  end if;

  if not (
    (current_order.status = 'payment_submitted'
      and requested_next_status = 'payment_verified')
    or
    (current_order.status = 'payment_verified'
      and requested_next_status = 'tag_preparation')
    or
    (current_order.status = 'tag_preparation'
      and requested_next_status = 'tag_activated')
    or
    (current_order.status = 'tag_activated'
      and requested_next_status = 'ready_to_ship')
    or
    (current_order.status = 'ready_to_ship'
      and requested_next_status = 'shipped')
    or
    (current_order.status = 'shipped'
      and requested_next_status = 'delivered')
  ) then
    raise exception
      'Invalid Guardian fulfillment transition from % to %.',
      current_order.status,
      requested_next_status;
  end if;

  if requested_next_status = 'shipped'
     and (
       nullif(trim(current_order.shipping_carrier), '') is null
       or nullif(trim(current_order.tracking_number), '') is null
     ) then
    raise exception
      'Carrier and tracking number are required before marking an order shipped.';
  end if;

  update public.guardian_orders
  set
    status = requested_next_status,

    payment_verified_at = case
      when requested_next_status = 'payment_verified'
        then coalesce(payment_verified_at, now())
      else payment_verified_at
    end,

    tag_preparation_at = case
      when requested_next_status = 'tag_preparation'
        then coalesce(tag_preparation_at, now())
      else tag_preparation_at
    end,

    tag_activated_at = case
      when requested_next_status = 'tag_activated'
        then coalesce(tag_activated_at, now())
      else tag_activated_at
    end,

    ready_to_ship_at = case
      when requested_next_status = 'ready_to_ship'
        then coalesce(ready_to_ship_at, now())
      else ready_to_ship_at
    end,

    shipped_at = case
      when requested_next_status = 'shipped'
        then coalesce(shipped_at, now())
      else shipped_at
    end,

    delivered_at = case
      when requested_next_status = 'delivered'
        then coalesce(delivered_at, now())
      else delivered_at
    end,

    fulfillment_updated_at = now()
  where order_id = current_order.order_id
  returning *
  into updated_order;

  event_title := case requested_next_status
    when 'payment_verified' then 'Payment verified'
    when 'tag_preparation' then 'Tag preparation started'
    when 'tag_activated' then 'Pet Tag activated'
    when 'ready_to_ship' then 'Ready to ship'
    when 'shipped' then 'Order shipped'
    when 'delivered' then 'Order delivered'
    else 'Order updated'
  end;

  event_detail := case requested_next_status
    when 'payment_verified'
      then 'The setup payment was verified.'
    when 'tag_preparation'
      then 'The Pet Tag moved into preparation.'
    when 'tag_activated'
      then 'The Pet Tag profile and recovery link were activated.'
    when 'ready_to_ship'
      then 'The completed Pet Tag is ready for shipping.'
    when 'shipped'
      then concat(
        'Shipped with ',
        updated_order.shipping_carrier,
        '. Tracking number: ',
        updated_order.tracking_number,
        '.'
      )
    when 'delivered'
      then 'The Pet Tag order was marked delivered.'
    else null
  end;

  insert into public.guardian_order_activity (
    order_id,
    event_type,
    title,
    detail,
    created_by
  )
  values (
    updated_order.order_id,
    requested_next_status,
    event_title,
    event_detail,
    auth.uid()
  );

  return updated_order;
end;
$$;

revoke all on function public.advance_guardian_fulfillment(text, text)
  from public;

grant execute on function public.advance_guardian_fulfillment(text, text)
  to authenticated;

-- ============================================================
-- OPERATOR SHIPPING DETAILS
-- ============================================================

create or replace function public.save_guardian_shipping_details(
  requested_order_id text,
  requested_carrier text,
  requested_tracking_number text,
  requested_tracking_url text default null,
  requested_estimated_delivery date default null
)
returns public.guardian_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_order public.guardian_orders;
begin
  if not public.is_guardian_operator() then
    raise exception 'Guardian operator access required.';
  end if;

  if nullif(trim(requested_carrier), '') is null then
    raise exception 'Shipping carrier is required.';
  end if;

  if nullif(trim(requested_tracking_number), '') is null then
    raise exception 'Tracking number is required.';
  end if;

  update public.guardian_orders
  set
    shipping_carrier = trim(requested_carrier),
    tracking_number = trim(requested_tracking_number),
    tracking_url = nullif(trim(requested_tracking_url), ''),
    estimated_delivery_date = requested_estimated_delivery,
    fulfillment_updated_at = now()
  where order_id = trim(requested_order_id)
    and status in ('tag_activated', 'ready_to_ship', 'shipped')
  returning *
  into updated_order;

  if not found then
    raise exception
      'Shipping details can only be added after activation and before delivery.';
  end if;

  insert into public.guardian_order_activity (
    order_id,
    event_type,
    title,
    detail,
    created_by
  )
  values (
    updated_order.order_id,
    'shipping_details_updated',
    'Shipping details added',
    concat(
      updated_order.shipping_carrier,
      ' tracking number ',
      updated_order.tracking_number,
      '.'
    ),
    auth.uid()
  );

  return updated_order;
end;
$$;

revoke all on function public.save_guardian_shipping_details(
  text,
  text,
  text,
  text,
  date
)
from public;

grant execute on function public.save_guardian_shipping_details(
  text,
  text,
  text,
  text,
  date
)
to authenticated;

-- ============================================================
-- SECURE CUSTOMER ORDER LOOKUP
-- ============================================================

create or replace function public.get_guardian_customer_order(
  requested_access_token uuid
)
returns setof public.guardian_orders
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.guardian_orders
  where customer_access_token = requested_access_token
  limit 1;
$$;

revoke all on function public.get_guardian_customer_order(uuid)
  from public;

grant execute on function public.get_guardian_customer_order(uuid)
  to anon, authenticated;

create or replace function public.get_guardian_customer_activity(
  requested_access_token uuid
)
returns table (
  event_type text,
  title text,
  detail text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    activity.event_type,
    activity.title,
    activity.detail,
    activity.created_at
  from public.guardian_order_activity activity
  inner join public.guardian_orders orders
    on orders.order_id = activity.order_id
  where orders.customer_access_token = requested_access_token
  order by activity.created_at asc;
$$;

revoke all on function public.get_guardian_customer_activity(uuid)
  from public;

grant execute on function public.get_guardian_customer_activity(uuid)
  to anon, authenticated;

-- ============================================================
-- PAYMENT SUBMISSION WITH ACTIVITY HISTORY
-- ============================================================

create or replace function public.submit_guardian_order_payment(
  submitted_order_id text,
  submitted_customer_email text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_order public.guardian_orders;
begin
  update public.guardian_orders
  set
    status = 'payment_submitted',
    payment_marked = true,
    payment_submitted_at = coalesce(payment_submitted_at, now()),
    fulfillment_updated_at = now()
  where order_id = trim(submitted_order_id)
    and lower(customer_email) = lower(trim(submitted_customer_email))
    and status = 'pending_payment'
    and coalesce(payment_marked, false) = false
  returning *
  into updated_order;

  if not found then
    return false;
  end if;

  insert into public.guardian_order_activity (
    order_id,
    event_type,
    title,
    detail
  )
  values (
    updated_order.order_id,
    'payment_submitted',
    'Payment submitted',
    'The customer submitted their payment for verification.'
  );

  return true;
end;
$$;

revoke all on function public.submit_guardian_order_payment(text, text)
  from public;

grant execute on function public.submit_guardian_order_payment(text, text)
  to anon, authenticated;

comment on table public.guardian_operators is
  'Approved authenticated accounts allowed to operate the Guardian Pet Tag fulfillment system.';

comment on table public.guardian_order_activity is
  'Timestamped fulfillment history shared between the Guardian operator board and customer order page.';
