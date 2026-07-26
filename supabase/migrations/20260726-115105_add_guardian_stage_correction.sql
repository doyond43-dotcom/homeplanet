-- Guardian Pet Tag secure operator stage correction.
-- This migration mirrors the function already applied through the SQL Editor.

create or replace function public.set_guardian_fulfillment_stage(
  requested_order_id text,
  requested_status text,
  requested_reason text default null
)
returns public.guardian_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  current_order public.guardian_orders;
  updated_order public.guardian_orders;
  previous_status text;
  clean_reason text;
begin
  if not public.is_guardian_operator() then
    raise exception 'Guardian operator access required.';
  end if;

  if requested_status not in (
    'pending_payment',
    'payment_submitted',
    'payment_verified',
    'tag_preparation',
    'tag_activated',
    'ready_to_ship',
    'shipped',
    'delivered'
  ) then
    raise exception 'Invalid Guardian fulfillment status.';
  end if;

  select *
  into current_order
  from public.guardian_orders
  where order_id = trim(requested_order_id)
  for update;

  if not found then
    raise exception 'Guardian order not found.';
  end if;

  previous_status := current_order.status;
  clean_reason := nullif(trim(requested_reason), '');

  if previous_status = requested_status then
    raise exception 'The order is already in that stage.';
  end if;

  if requested_status = 'shipped'
     and (
       nullif(trim(current_order.shipping_carrier), '') is null
       or nullif(trim(current_order.tracking_number), '') is null
     ) then
    raise exception
      'Carrier and tracking number are required before setting an order to Shipped.';
  end if;

  update public.guardian_orders
  set
    status = requested_status,

    payment_verified_at = case
      when requested_status = 'payment_verified'
        then coalesce(payment_verified_at, now())
      else payment_verified_at
    end,

    tag_preparation_at = case
      when requested_status = 'tag_preparation'
        then coalesce(tag_preparation_at, now())
      else tag_preparation_at
    end,

    tag_activated_at = case
      when requested_status = 'tag_activated'
        then coalesce(tag_activated_at, now())
      else tag_activated_at
    end,

    ready_to_ship_at = case
      when requested_status = 'ready_to_ship'
        then coalesce(ready_to_ship_at, now())
      else ready_to_ship_at
    end,

    shipped_at = case
      when requested_status = 'shipped'
        then coalesce(shipped_at, now())
      else shipped_at
    end,

    delivered_at = case
      when requested_status = 'delivered'
        then coalesce(delivered_at, now())
      else delivered_at
    end,

    fulfillment_updated_at = now()
  where order_id = current_order.order_id
  returning *
  into updated_order;

  insert into public.guardian_order_activity (
    order_id,
    event_type,
    title,
    detail,
    created_by
  )
  values (
    updated_order.order_id,
    'stage_corrected',
    'Order stage corrected',
    concat(
      'Stage changed from ',
      previous_status,
      ' to ',
      requested_status,
      case
        when clean_reason is not null
          then concat('. Reason: ', clean_reason)
        else '.'
      end
    ),
    auth.uid()
  );

  return updated_order;
end;
$$;

revoke all on function public.set_guardian_fulfillment_stage(
  text,
  text,
  text
)
from public;

grant execute on function public.set_guardian_fulfillment_stage(
  text,
  text,
  text
)
to authenticated;
