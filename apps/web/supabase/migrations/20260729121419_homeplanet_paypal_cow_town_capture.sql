begin;

create or replace function public.record_homeplanet_paypal_order(
  requested_access_token uuid,
  requested_paypal_order_id text,
  requested_provider_payload jsonb default '{}'::jsonb
)
returns public.homeplanet_checkout_sessions
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  checkout_record public.homeplanet_checkout_sessions;
  transaction_record public.homeplanet_payment_transactions;
  cow_town_order public.cow_town_orders;
begin
  if nullif(trim(requested_paypal_order_id), '') is null then
    raise exception 'PayPal order ID is required.';
  end if;

  select *
  into checkout_record
  from public.homeplanet_checkout_sessions
  where customer_access_token = requested_access_token
  for update;

  if not found then
    raise exception 'Checkout not found.';
  end if;

  if checkout_record.status = 'paid' then
    return checkout_record;
  end if;

  if checkout_record.status not in (
    'open',
    'approval_pending'
  ) then
    raise exception 'Checkout is not available for PayPal approval.';
  end if;

  select *
  into transaction_record
  from public.homeplanet_payment_transactions
  where provider = 'paypal'
    and provider_order_id = trim(requested_paypal_order_id)
  for update;

  if found then
    if transaction_record.checkout_session_id <> checkout_record.id then
      raise exception 'PayPal order belongs to another checkout.';
    end if;

    update public.homeplanet_payment_transactions
    set
      status = case
        when status in ('verified', 'refunded', 'partially_refunded')
          then status
        else 'approval_pending'
      end,
      provider_payload =
        provider_payload ||
        coalesce(requested_provider_payload, '{}'::jsonb)
    where id = transaction_record.id;
  else
    insert into public.homeplanet_payment_transactions (
      checkout_session_id,
      provider,
      provider_order_id,
      payment_method,
      amount,
      currency,
      status,
      provider_payload
    )
    values (
      checkout_record.id,
      'paypal',
      trim(requested_paypal_order_id),
      'paypal',
      checkout_record.total_amount,
      checkout_record.currency,
      'approval_pending',
      coalesce(requested_provider_payload, '{}'::jsonb)
    )
    returning *
    into transaction_record;
  end if;

  update public.homeplanet_checkout_sessions
  set
    status = 'approval_pending',
    selected_payment_method = 'paypal',
    updated_at = now()
  where id = checkout_record.id
  returning *
  into checkout_record;

  if checkout_record.product_type = 'cow_town_tags' then
    update public.cow_town_orders
    set
      status = case
        when status = 'pending_payment'
          then 'payment_processing'
        else status
      end,
      payment_provider = 'paypal',
      payment_provider_order_id =
        trim(requested_paypal_order_id),
      updated_at = now()
    where order_number = checkout_record.product_order_id
    returning *
    into cow_town_order;

    if not found then
      raise exception 'Cow Town order not found.';
    end if;

    if not exists (
      select 1
      from public.cow_town_activity activity
      where activity.order_id = cow_town_order.id
        and activity.activity_type = 'paypal_order_created'
        and activity.metadata ->> 'paypal_order_id' =
          trim(requested_paypal_order_id)
    ) then
      insert into public.cow_town_activity (
        ranch_id,
        order_id,
        activity_type,
        title,
        detail,
        metadata
      )
      values (
        cow_town_order.ranch_id,
        cow_town_order.id,
        'paypal_order_created',
        'PayPal checkout opened',
        'The customer opened the secure PayPal checkout.',
        jsonb_build_object(
          'paypal_order_id',
          trim(requested_paypal_order_id)
        )
      );
    end if;
  end if;

  if not exists (
    select 1
    from public.homeplanet_checkout_activity activity
    where activity.checkout_session_id = checkout_record.id
      and activity.event_type = 'paypal_order_created'
      and activity.detail like
        '%' || trim(requested_paypal_order_id) || '%'
  ) then
    perform public.record_homeplanet_checkout_activity(
      checkout_record.id,
      'paypal_order_created',
      'PayPal checkout opened',
      'PayPal order ' ||
        trim(requested_paypal_order_id) ||
        ' was created and is waiting for customer approval.',
      transaction_record.id,
      null
    );
  end if;

  return checkout_record;
end;
$$;

revoke all on function
  public.record_homeplanet_paypal_order(uuid, text, jsonb)
from public;

grant execute on function
  public.record_homeplanet_paypal_order(uuid, text, jsonb)
to service_role;


create or replace function public.complete_homeplanet_paypal_capture(
  requested_access_token uuid,
  requested_paypal_order_id text,
  requested_paypal_capture_id text,
  requested_captured_amount numeric,
  requested_currency text,
  requested_provider_payload jsonb default '{}'::jsonb
)
returns public.homeplanet_checkout_sessions
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  checkout_record public.homeplanet_checkout_sessions;
  transaction_record public.homeplanet_payment_transactions;
  cow_town_order public.cow_town_orders;
  normalized_currency text;
begin
  if nullif(trim(requested_paypal_order_id), '') is null then
    raise exception 'PayPal order ID is required.';
  end if;

  if nullif(trim(requested_paypal_capture_id), '') is null then
    raise exception 'PayPal capture ID is required.';
  end if;

  normalized_currency := upper(trim(requested_currency));

  select *
  into checkout_record
  from public.homeplanet_checkout_sessions
  where customer_access_token = requested_access_token
  for update;

  if not found then
    raise exception 'Checkout not found.';
  end if;

  if round(requested_captured_amount, 2) <>
     round(checkout_record.total_amount, 2) then
    raise exception 'Captured amount does not match checkout total.';
  end if;

  if normalized_currency <> checkout_record.currency then
    raise exception 'Captured currency does not match checkout currency.';
  end if;

  select *
  into transaction_record
  from public.homeplanet_payment_transactions
  where checkout_session_id = checkout_record.id
    and provider = 'paypal'
    and provider_order_id = trim(requested_paypal_order_id)
  for update;

  if not found then
    raise exception 'PayPal transaction not found.';
  end if;

  if transaction_record.status = 'verified' then
    if transaction_record.provider_capture_id =
       trim(requested_paypal_capture_id) then
      return checkout_record;
    end if;

    raise exception 'Checkout was already verified with another capture.';
  end if;

  if exists (
    select 1
    from public.homeplanet_payment_transactions existing
    where existing.provider = 'paypal'
      and existing.provider_capture_id =
        trim(requested_paypal_capture_id)
      and existing.id <> transaction_record.id
  ) then
    raise exception 'PayPal capture was already used.';
  end if;

  update public.homeplanet_payment_transactions
  set
    provider_capture_id = trim(requested_paypal_capture_id),
    status = 'verified',
    verification_method = 'paypal_capture',
    provider_payload =
      provider_payload ||
      coalesce(requested_provider_payload, '{}'::jsonb),
    submitted_at = coalesce(submitted_at, now()),
    verified_at = coalesce(verified_at, now())
  where id = transaction_record.id
  returning *
  into transaction_record;

  update public.homeplanet_checkout_sessions
  set
    status = 'paid',
    selected_payment_method = 'paypal',
    completed_at = coalesce(completed_at, now()),
    updated_at = now()
  where id = checkout_record.id
  returning *
  into checkout_record;

  if checkout_record.product_type = 'cow_town_tags' then
    update public.cow_town_orders
    set
      status = 'payment_verified',
      payment_provider = 'paypal',
      payment_provider_order_id =
        trim(requested_paypal_order_id),
      payment_provider_capture_id =
        trim(requested_paypal_capture_id),
      updated_at = now()
    where order_number = checkout_record.product_order_id
    returning *
    into cow_town_order;

    if not found then
      raise exception 'Cow Town order not found.';
    end if;

    if not exists (
      select 1
      from public.cow_town_activity activity
      where activity.order_id = cow_town_order.id
        and activity.activity_type = 'payment_verified'
        and activity.metadata ->> 'paypal_capture_id' =
          trim(requested_paypal_capture_id)
    ) then
      insert into public.cow_town_activity (
        ranch_id,
        order_id,
        activity_type,
        title,
        detail,
        metadata
      )
      values (
        cow_town_order.ranch_id,
        cow_town_order.id,
        'payment_verified',
        'PayPal payment verified',
        'The Cow Town order payment was captured and verified.',
        jsonb_build_object(
          'paypal_order_id',
          trim(requested_paypal_order_id),
          'paypal_capture_id',
          trim(requested_paypal_capture_id),
          'amount',
          round(requested_captured_amount, 2),
          'currency',
          normalized_currency
        )
      );
    end if;
  end if;

  if not exists (
    select 1
    from public.homeplanet_checkout_activity activity
    where activity.checkout_session_id = checkout_record.id
      and activity.event_type = 'paypal_payment_verified'
  ) then
    perform public.record_homeplanet_checkout_activity(
      checkout_record.id,
      'paypal_payment_verified',
      'PayPal payment verified',
      'PayPal capture ' ||
        trim(requested_paypal_capture_id) ||
        ' was verified for ' ||
        normalized_currency ||
        ' ' ||
        round(requested_captured_amount, 2)::text ||
        '.',
      transaction_record.id,
      null
    );
  end if;

  return checkout_record;
end;
$$;

revoke all on function
  public.complete_homeplanet_paypal_capture(
    uuid,
    text,
    text,
    numeric,
    text,
    jsonb
  )
from public;

grant execute on function
  public.complete_homeplanet_paypal_capture(
    uuid,
    text,
    text,
    numeric,
    text,
    jsonb
  )
to service_role;

commit;