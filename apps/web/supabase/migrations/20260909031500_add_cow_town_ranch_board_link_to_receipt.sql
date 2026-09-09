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
      'email', r.primary_email,
      'management_access_token', r.management_access_token
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
