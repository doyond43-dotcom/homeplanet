begin;

create extension if not exists pgcrypto;

-- ============================================================
-- SHARED HOMEPLANET CHECKOUT TABLES
-- ============================================================

create table if not exists public.homeplanet_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  checkout_reference text not null unique,
  product_type text not null,
  product_order_id text not null,
  customer_name text,
  customer_email text,
  customer_phone text,
  currency text not null default 'USD',
  subtotal_amount numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null,
  status text not null default 'open'
    check (
      status in (
        'open',
        'approval_pending',
        'payment_submitted',
        'paid',
        'failed',
        'cancelled',
        'refunded',
        'partially_refunded'
      )
    ),
  selected_payment_method text
    check (
      selected_payment_method is null
      or selected_payment_method in (
        'paypal',
        'cash',
        'cash_app',
        'zelle',
        'manual'
      )
    ),
  customer_access_token uuid not null default gen_random_uuid(),
  success_url text,
  cancel_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (product_type, product_order_id),
  unique (customer_access_token),
  check (currency ~ '^[A-Z]{3}$'),
  check (subtotal_amount >= 0),
  check (discount_amount >= 0),
  check (tax_amount >= 0),
  check (total_amount >= 0)
);

create table if not exists public.homeplanet_payment_transactions (
  id uuid primary key default gen_random_uuid(),
  checkout_session_id uuid not null
    references public.homeplanet_checkout_sessions(id)
    on delete cascade,
  provider text not null
    check (
      provider in (
        'paypal',
        'cash',
        'cash_app',
        'zelle',
        'manual'
      )
    ),
  provider_order_id text,
  provider_capture_id text,
  payment_method text not null
    check (
      payment_method in (
        'paypal',
        'cash',
        'cash_app',
        'zelle',
        'manual'
      )
    ),
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  status text not null default 'created'
    check (
      status in (
        'created',
        'approval_pending',
        'submitted',
        'captured',
        'verified',
        'failed',
        'cancelled',
        'refunded',
        'partially_refunded'
      )
    ),
  verification_method text
    check (
      verification_method is null
      or verification_method in (
        'paypal_capture',
        'paypal_webhook',
        'operator',
        'cash_received',
        'manual'
      )
    ),
  provider_payload jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  verified_at timestamptz,
  failed_at timestamptz,
  refunded_at timestamptz,
  check (amount >= 0),
  check (currency ~ '^[A-Z]{3}$')
);

create table if not exists public.homeplanet_checkout_activity (
  id uuid primary key default gen_random_uuid(),
  checkout_session_id uuid not null
    references public.homeplanet_checkout_sessions(id)
    on delete cascade,
  event_type text not null,
  title text not null,
  detail text,
  transaction_id uuid
    references public.homeplanet_payment_transactions(id)
    on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists
  homeplanet_checkout_sessions_status_created_idx
  on public.homeplanet_checkout_sessions(status, created_at desc);

create index if not exists
  homeplanet_checkout_sessions_product_idx
  on public.homeplanet_checkout_sessions(product_type, product_order_id);

create index if not exists
  homeplanet_payment_transactions_checkout_created_idx
  on public.homeplanet_payment_transactions(checkout_session_id, created_at desc);

create index if not exists
  homeplanet_checkout_activity_checkout_created_idx
  on public.homeplanet_checkout_activity(checkout_session_id, created_at asc);

create unique index if not exists
  homeplanet_payment_transactions_provider_order_unique
  on public.homeplanet_payment_transactions(provider, provider_order_id)
  where provider_order_id is not null;

create unique index if not exists
  homeplanet_payment_transactions_provider_capture_unique
  on public.homeplanet_payment_transactions(provider, provider_capture_id)
  where provider_capture_id is not null;

alter table public.homeplanet_checkout_sessions enable row level security;
alter table public.homeplanet_payment_transactions enable row level security;
alter table public.homeplanet_checkout_activity enable row level security;

-- No direct public table policies are intentionally created.
-- Customer and operator access goes through narrowly scoped security-definer RPCs.

-- ============================================================
-- INTERNAL HELPERS
-- ============================================================

create or replace function public.make_homeplanet_checkout_reference()
returns text
language sql
volatile
set search_path = public
as $$
  select
    'HPC-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
$$;

revoke all on function public.make_homeplanet_checkout_reference()
  from public;

create or replace function public.record_homeplanet_checkout_activity(
  requested_checkout_session_id uuid,
  requested_event_type text,
  requested_title text,
  requested_detail text default null,
  requested_transaction_id uuid default null,
  requested_created_by uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.homeplanet_checkout_activity (
    checkout_session_id,
    event_type,
    title,
    detail,
    transaction_id,
    created_by
  )
  values (
    requested_checkout_session_id,
    trim(requested_event_type),
    trim(requested_title),
    nullif(trim(requested_detail), ''),
    requested_transaction_id,
    requested_created_by
  );
end;
$$;

revoke all on function public.record_homeplanet_checkout_activity(
  uuid, text, text, text, uuid, uuid
)
from public;

-- ============================================================
-- GUARDIAN PRODUCT ADAPTER
-- ============================================================

create or replace function public.create_guardian_homeplanet_checkout(
  requested_order_id text,
  requested_access_token uuid
)
returns public.homeplanet_checkout_sessions
language plpgsql
security definer
set search_path = public
as $$
declare
  guardian_order public.guardian_orders;
  checkout public.homeplanet_checkout_sessions;
  checkout_status text;
  checkout_method text;
begin
  select *
  into guardian_order
  from public.guardian_orders
  where order_id = trim(requested_order_id)
    and customer_access_token = requested_access_token;

  if not found then
    raise exception 'Guardian order not found.';
  end if;

  checkout_status := case
    when guardian_order.status = 'pending_payment'
      then 'open'
    when guardian_order.status = 'payment_submitted'
      then 'payment_submitted'
    else 'paid'
  end;

  checkout_method := case lower(coalesce(guardian_order.payment_method, ''))
    when 'cashapp' then 'cash_app'
    when 'cash_app' then 'cash_app'
    when 'zelle' then 'zelle'
    when 'paypal' then 'paypal'
    when 'cash' then 'cash'
    else null
  end;

  insert into public.homeplanet_checkout_sessions (
    checkout_reference,
    product_type,
    product_order_id,
    customer_name,
    customer_email,
    customer_phone,
    currency,
    subtotal_amount,
    discount_amount,
    tax_amount,
    total_amount,
    status,
    selected_payment_method,
    customer_access_token,
    completed_at,
    metadata
  )
  values (
    public.make_homeplanet_checkout_reference(),
    'guardian_pet_tag',
    guardian_order.order_id,
    guardian_order.customer_name,
    guardian_order.customer_email,
    guardian_order.customer_phone,
    'USD',
    guardian_order.setup_total,
    0,
    0,
    guardian_order.setup_total,
    checkout_status,
    checkout_method,
    guardian_order.customer_access_token,
    case when checkout_status = 'paid' then
      coalesce(guardian_order.payment_verified_at, now())
    else null end,
    jsonb_build_object(
      'pet_count', guardian_order.pet_count,
      'monthly_total', guardian_order.monthly_total,
      'guardian_status', guardian_order.status
    )
  )
  on conflict (product_type, product_order_id)
  do update set
    customer_name = excluded.customer_name,
    customer_email = excluded.customer_email,
    customer_phone = excluded.customer_phone,
    subtotal_amount = excluded.subtotal_amount,
    total_amount = excluded.total_amount,
    selected_payment_method = coalesce(
      public.homeplanet_checkout_sessions.selected_payment_method,
      excluded.selected_payment_method
    ),
    metadata = public.homeplanet_checkout_sessions.metadata || excluded.metadata,
    updated_at = now()
  returning *
  into checkout;

  if not exists (
    select 1
    from public.homeplanet_checkout_activity activity
    where activity.checkout_session_id = checkout.id
      and activity.event_type = 'checkout_created'
  ) then
    perform public.record_homeplanet_checkout_activity(
      checkout.id,
      'checkout_created',
      'Checkout created',
      'HomePlanet Checkout was created for the Guardian Pet Tag order.',
      null,
      null
    );
  end if;

  return checkout;
end;
$$;

revoke all on function public.create_guardian_homeplanet_checkout(text, uuid)
  from public;

grant execute on function public.create_guardian_homeplanet_checkout(text, uuid)
  to anon, authenticated;

-- ============================================================
-- CUSTOMER CHECKOUT READ
-- ============================================================

create or replace function public.get_homeplanet_checkout(
  requested_access_token uuid
)
returns table (
  id uuid,
  checkout_reference text,
  product_type text,
  product_order_id text,
  customer_name text,
  currency text,
  subtotal_amount numeric,
  discount_amount numeric,
  tax_amount numeric,
  total_amount numeric,
  status text,
  selected_payment_method text,
  created_at timestamptz,
  updated_at timestamptz,
  completed_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    checkout.id,
    checkout.checkout_reference,
    checkout.product_type,
    checkout.product_order_id,
    checkout.customer_name,
    checkout.currency,
    checkout.subtotal_amount,
    checkout.discount_amount,
    checkout.tax_amount,
    checkout.total_amount,
    checkout.status,
    checkout.selected_payment_method,
    checkout.created_at,
    checkout.updated_at,
    checkout.completed_at
  from public.homeplanet_checkout_sessions checkout
  where checkout.customer_access_token = requested_access_token;
$$;

revoke all on function public.get_homeplanet_checkout(uuid)
  from public;

grant execute on function public.get_homeplanet_checkout(uuid)
  to anon, authenticated;

create or replace function public.get_homeplanet_checkout_activity(
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
  from public.homeplanet_checkout_activity activity
  inner join public.homeplanet_checkout_sessions checkout
    on checkout.id = activity.checkout_session_id
  where checkout.customer_access_token = requested_access_token
  order by activity.created_at asc;
$$;

revoke all on function public.get_homeplanet_checkout_activity(uuid)
  from public;

grant execute on function public.get_homeplanet_checkout_activity(uuid)
  to anon, authenticated;

-- ============================================================
-- MANUAL PAYMENT SUBMISSION
-- ============================================================

create or replace function public.submit_homeplanet_manual_payment(
  requested_access_token uuid,
  requested_payment_method text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  checkout public.homeplanet_checkout_sessions;
  transaction public.homeplanet_payment_transactions;
  normalized_method text;
begin
  normalized_method := lower(trim(requested_payment_method));

  if normalized_method not in ('cash_app', 'zelle') then
    raise exception 'Invalid customer-submitted payment method.';
  end if;

  select *
  into checkout
  from public.homeplanet_checkout_sessions
  where customer_access_token = requested_access_token
  for update;

  if not found then
    raise exception 'Checkout not found.';
  end if;

  if checkout.status = 'paid' then
    return true;
  end if;

  if checkout.status not in ('open', 'approval_pending') then
    raise exception 'Checkout is not available for payment submission.';
  end if;

  insert into public.homeplanet_payment_transactions (
    checkout_session_id,
    provider,
    payment_method,
    amount,
    currency,
    status,
    submitted_at
  )
  values (
    checkout.id,
    normalized_method,
    normalized_method,
    checkout.total_amount,
    checkout.currency,
    'submitted',
    now()
  )
  returning *
  into transaction;

  update public.homeplanet_checkout_sessions
  set
    status = 'payment_submitted',
    selected_payment_method = normalized_method,
    updated_at = now()
  where id = checkout.id;

  if checkout.product_type = 'guardian_pet_tag' then
    update public.guardian_orders
    set
      status = 'payment_submitted',
      payment_method = case
        when normalized_method = 'cash_app' then 'cashapp'
        else normalized_method
      end,
      payment_marked = true,
      payment_submitted_at = coalesce(payment_submitted_at, now()),
      fulfillment_updated_at = now()
    where order_id = checkout.product_order_id
      and status = 'pending_payment';

    if not exists (
      select 1
      from public.guardian_order_activity
      where order_id = checkout.product_order_id
        and event_type = 'payment_submitted'
    ) then
      insert into public.guardian_order_activity (
        order_id,
        event_type,
        title,
        detail
      )
      values (
        checkout.product_order_id,
        'payment_submitted',
        'Payment submitted',
        'The customer submitted their payment for verification.'
      );
    end if;
  end if;

  perform public.record_homeplanet_checkout_activity(
    checkout.id,
    'manual_payment_submitted',
    'Payment submitted',
    case
      when normalized_method = 'cash_app'
        then 'The customer marked their Cash App payment as submitted.'
      else 'The customer marked their Zelle payment as submitted.'
    end,
    transaction.id,
    null
  );

  return true;
end;
$$;

revoke all on function public.submit_homeplanet_manual_payment(uuid, text)
  from public;

grant execute on function public.submit_homeplanet_manual_payment(uuid, text)
  to anon, authenticated;

-- ============================================================
-- OPERATOR VERIFICATION AND CASH COLLECTION
-- ============================================================

create or replace function public.verify_homeplanet_manual_payment(
  requested_checkout_id uuid,
  requested_transaction_id uuid
)
returns public.homeplanet_checkout_sessions
language plpgsql
security definer
set search_path = public
as $$
declare
  checkout public.homeplanet_checkout_sessions;
  transaction public.homeplanet_payment_transactions;
begin
  if not public.is_guardian_operator() then
    raise exception 'Guardian operator access required.';
  end if;

  select *
  into checkout
  from public.homeplanet_checkout_sessions
  where id = requested_checkout_id
  for update;

  if not found then
    raise exception 'Checkout not found.';
  end if;

  if checkout.status = 'paid' then
    return checkout;
  end if;

  select *
  into transaction
  from public.homeplanet_payment_transactions
  where id = requested_transaction_id
    and checkout_session_id = checkout.id
  for update;

  if not found then
    raise exception 'Payment transaction not found.';
  end if;

  if transaction.status not in ('submitted', 'captured') then
    raise exception 'Payment transaction is not ready for verification.';
  end if;

  update public.homeplanet_payment_transactions
  set
    status = 'verified',
    verification_method = 'operator',
    verified_at = coalesce(verified_at, now())
  where id = transaction.id;

  update public.homeplanet_checkout_sessions
  set
    status = 'paid',
    selected_payment_method = transaction.payment_method,
    completed_at = coalesce(completed_at, now()),
    updated_at = now()
  where id = checkout.id
  returning *
  into checkout;

  if checkout.product_type = 'guardian_pet_tag' then
    update public.guardian_orders
    set
      status = 'payment_verified',
      payment_marked = true,
      payment_verified_at = coalesce(payment_verified_at, now()),
      fulfillment_updated_at = now()
    where order_id = checkout.product_order_id
      and status in ('pending_payment', 'payment_submitted');

    if not exists (
      select 1
      from public.guardian_order_activity
      where order_id = checkout.product_order_id
        and event_type = 'payment_verified'
    ) then
      insert into public.guardian_order_activity (
        order_id,
        event_type,
        title,
        detail,
        created_by
      )
      values (
        checkout.product_order_id,
        'payment_verified',
        'Payment verified',
        'The setup payment was verified.',
        auth.uid()
      );
    end if;
  end if;

  perform public.record_homeplanet_checkout_activity(
    checkout.id,
    'manual_payment_verified',
    'Payment verified',
    'An authorized operator verified the payment.',
    transaction.id,
    auth.uid()
  );

  perform public.record_homeplanet_checkout_activity(
    checkout.id,
    'fulfillment_released',
    'Released to fulfillment',
    'The verified payment released the product order into fulfillment.',
    transaction.id,
    auth.uid()
  );

  return checkout;
end;
$$;

revoke all on function public.verify_homeplanet_manual_payment(uuid, uuid)
  from public;

grant execute on function public.verify_homeplanet_manual_payment(uuid, uuid)
  to authenticated;

create or replace function public.record_homeplanet_cash_payment(
  requested_checkout_id uuid
)
returns public.homeplanet_checkout_sessions
language plpgsql
security definer
set search_path = public
as $$
declare
  checkout public.homeplanet_checkout_sessions;
  transaction public.homeplanet_payment_transactions;
begin
  if not public.is_guardian_operator() then
    raise exception 'Guardian operator access required.';
  end if;

  select *
  into checkout
  from public.homeplanet_checkout_sessions
  where id = requested_checkout_id
  for update;

  if not found then
    raise exception 'Checkout not found.';
  end if;

  if checkout.status = 'paid' then
    return checkout;
  end if;

  insert into public.homeplanet_payment_transactions (
    checkout_session_id,
    provider,
    payment_method,
    amount,
    currency,
    status,
    verification_method,
    created_by,
    submitted_at,
    verified_at
  )
  values (
    checkout.id,
    'cash',
    'cash',
    checkout.total_amount,
    checkout.currency,
    'verified',
    'cash_received',
    auth.uid(),
    now(),
    now()
  )
  returning *
  into transaction;

  update public.homeplanet_checkout_sessions
  set
    status = 'paid',
    selected_payment_method = 'cash',
    completed_at = coalesce(completed_at, now()),
    updated_at = now()
  where id = checkout.id
  returning *
  into checkout;

  if checkout.product_type = 'guardian_pet_tag' then
    update public.guardian_orders
    set
      status = 'payment_verified',
      payment_method = 'cash',
      payment_marked = true,
      payment_submitted_at = coalesce(payment_submitted_at, now()),
      payment_verified_at = coalesce(payment_verified_at, now()),
      fulfillment_updated_at = now()
    where order_id = checkout.product_order_id
      and status in ('pending_payment', 'payment_submitted');

    if not exists (
      select 1
      from public.guardian_order_activity
      where order_id = checkout.product_order_id
        and event_type = 'payment_verified'
    ) then
      insert into public.guardian_order_activity (
        order_id,
        event_type,
        title,
        detail,
        created_by
      )
      values (
        checkout.product_order_id,
        'payment_verified',
        'Cash payment verified',
        'Cash was received and verified during the in-person order.',
        auth.uid()
      );
    end if;
  end if;

  perform public.record_homeplanet_checkout_activity(
    checkout.id,
    'cash_payment_verified',
    'Cash payment received',
    'An authorized operator received and verified the cash payment.',
    transaction.id,
    auth.uid()
  );

  perform public.record_homeplanet_checkout_activity(
    checkout.id,
    'fulfillment_released',
    'Released to fulfillment',
    'The verified cash payment released the product order into fulfillment.',
    transaction.id,
    auth.uid()
  );

  return checkout;
end;
$$;

revoke all on function public.record_homeplanet_cash_payment(uuid)
  from public;

grant execute on function public.record_homeplanet_cash_payment(uuid)
  to authenticated;

-- ============================================================
-- OPERATOR CHECKOUT READ
-- ============================================================

create or replace function public.get_homeplanet_operator_checkout(
  requested_product_type text,
  requested_product_order_id text
)
returns table (
  checkout_id uuid,
  checkout_reference text,
  checkout_status text,
  selected_payment_method text,
  total_amount numeric,
  currency text,
  completed_at timestamptz,
  transaction_id uuid,
  transaction_provider text,
  transaction_status text,
  provider_order_id text,
  provider_capture_id text,
  verification_method text,
  submitted_at timestamptz,
  verified_at timestamptz
)
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
  select
    checkout.id,
    checkout.checkout_reference,
    checkout.status,
    checkout.selected_payment_method,
    checkout.total_amount,
    checkout.currency,
    checkout.completed_at,
    transaction.id,
    transaction.provider,
    transaction.status,
    transaction.provider_order_id,
    transaction.provider_capture_id,
    transaction.verification_method,
    transaction.submitted_at,
    transaction.verified_at
  from public.homeplanet_checkout_sessions checkout
  left join lateral (
    select payment.*
    from public.homeplanet_payment_transactions payment
    where payment.checkout_session_id = checkout.id
    order by payment.created_at desc
    limit 1
  ) transaction on true
  where checkout.product_type = trim(requested_product_type)
    and checkout.product_order_id = trim(requested_product_order_id);
end;
$$;

revoke all on function public.get_homeplanet_operator_checkout(text, text)
  from public;

grant execute on function public.get_homeplanet_operator_checkout(text, text)
  to authenticated;

comment on table public.homeplanet_checkout_sessions is
  'Reusable checkout sessions connecting HomePlanet product orders to payment processing.';

comment on table public.homeplanet_payment_transactions is
  'Immutable-style payment attempt and verification records for HomePlanet Checkout.';

comment on table public.homeplanet_checkout_activity is
  'Timestamped HomePlanet Checkout Truth Chain events.';

commit;