begin;

create or replace function public.create_cow_town_homeplanet_checkout(
  requested_order_number text,
  requested_access_token uuid
)
returns public.homeplanet_checkout_sessions
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  cow_town_order public.cow_town_orders;
  ranch_record public.cow_town_ranches;
  checkout_record public.homeplanet_checkout_sessions;
  checkout_status text;
begin
  select *
  into cow_town_order
  from public.cow_town_orders
  where order_number = trim(requested_order_number)
    and customer_access_token = requested_access_token;

  if not found then
    raise exception 'Cow Town order not found.';
  end if;

  select *
  into ranch_record
  from public.cow_town_ranches
  where id = cow_town_order.ranch_id;

  if not found then
    raise exception 'Cow Town ranch account not found.';
  end if;

  checkout_status := case
    when cow_town_order.status = 'pending_payment'
      then 'open'
    when cow_town_order.status in (
      'payment_processing',
      'payment_submitted'
    )
      then 'payment_submitted'
    when cow_town_order.status in (
      'payment_verified',
      'batch_setup',
      'in_production',
      'qr_verification',
      'activated',
      'ready_to_ship',
      'shipped',
      'delivered',
      'completed'
    )
      then 'paid'
    when cow_town_order.status = 'cancelled'
      then 'cancelled'
    else 'open'
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
    'cow_town_tags',
    cow_town_order.order_number,
    ranch_record.primary_contact_name,
    ranch_record.primary_email,
    ranch_record.primary_phone,
    cow_town_order.currency,
    cow_town_order.one_time_total,
    0,
    0,
    cow_town_order.one_time_total,
    checkout_status,
    case
      when cow_town_order.payment_provider = 'paypal'
        then 'paypal'
      else null
    end,
    cow_town_order.customer_access_token,
    case
      when checkout_status = 'paid'
        then now()
      else null
    end,
    jsonb_build_object(
      'ranch_id', cow_town_order.ranch_id,
      'plan_id', cow_town_order.plan_id,
      'monthly_plan_amount', cow_town_order.monthly_plan_amount,
      'full_tag_quantity', cow_town_order.full_tag_quantity,
      'sticker_quantity', cow_town_order.sticker_quantity,
      'cow_town_status', cow_town_order.status
    )
  )
  on conflict (product_type, product_order_id)
  do update set
    customer_name = excluded.customer_name,
    customer_email = excluded.customer_email,
    customer_phone = excluded.customer_phone,
    currency = excluded.currency,
    subtotal_amount = excluded.subtotal_amount,
    total_amount = excluded.total_amount,
    status = case
      when public.homeplanet_checkout_sessions.status = 'paid'
        then 'paid'
      else excluded.status
    end,
    metadata =
      public.homeplanet_checkout_sessions.metadata ||
      excluded.metadata,
    updated_at = now()
  returning *
  into checkout_record;

  if not exists (
    select 1
    from public.homeplanet_checkout_activity activity
    where activity.checkout_session_id = checkout_record.id
      and activity.event_type = 'checkout_created'
  ) then
    perform public.record_homeplanet_checkout_activity(
      checkout_record.id,
      'checkout_created',
      'Cow Town checkout created',
      'HomePlanet Checkout was created for the Cow Town Tags order.',
      null,
      null
    );
  end if;

  return checkout_record;
end;
$$;

revoke all on function
  public.create_cow_town_homeplanet_checkout(text, uuid)
from public;

grant execute on function
  public.create_cow_town_homeplanet_checkout(text, uuid)
to anon, authenticated;

commit;