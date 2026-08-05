-- Adds Guardian Pet Tag completion to the shared PayPal capture workflow.
-- PayPal owns payment capture and verification.
-- HomePlanet advances the Guardian order and fulfillment truth chain.
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
  guardian_order public.guardian_orders;
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


  if checkout_record.product_type = 'guardian_pet_tag' then
    update public.guardian_orders
    set
      status = 'payment_verified',
      payment_verified_at = coalesce(payment_verified_at, now()),
      fulfillment_updated_at = now()
    where order_id = checkout_record.product_order_id
    returning *
    into guardian_order;

    if not found then
      raise exception 'Guardian Pet Tag order not found.';
    end if;

    if not exists (
      select 1
      from public.guardian_order_activity activity
      where activity.order_id = guardian_order.order_id
        and activity.event_type = 'payment_verified'
    ) then
      insert into public.guardian_order_activity (
        order_id,
        event_type,
        title,
        detail
      )
      values (
        guardian_order.order_id,
        'payment_verified',
        'PayPal payment verified',
        'The Guardian Pet Tag setup payment was captured and verified through PayPal.'
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

