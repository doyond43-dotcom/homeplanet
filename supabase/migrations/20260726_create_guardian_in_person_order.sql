create or replace function public.create_guardian_in_person_order(
  requested_customer_name text,
  requested_customer_email text,
  requested_customer_phone text,
  requested_shipping_address text,
  requested_shipping_city text,
  requested_shipping_state text,
  requested_shipping_zip text,
  requested_pet_name text,
  requested_pet_type text,
  requested_pet_breed text,
  requested_pet_age text,
  requested_pet_color text,
  requested_pet_notes text,
  requested_pet_photo_data_url text,
  requested_payment_status text
)
returns public.guardian_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  next_order_id text;
  next_access_token uuid;
  next_payment_marked boolean;
  next_payment_method text;
  created_order public.guardian_orders;
begin
  if not public.is_guardian_operator() then
    raise exception 'Guardian operator access required.';
  end if;

  if nullif(trim(requested_customer_name), '') is null then
    raise exception 'Customer name is required.';
  end if;

  if nullif(trim(requested_customer_email), '') is null then
    raise exception 'Customer email is required.';
  end if;

  if nullif(trim(requested_shipping_address), '') is null then
    raise exception 'Street address is required.';
  end if;

  if nullif(trim(requested_shipping_city), '') is null then
    raise exception 'City is required.';
  end if;

  if nullif(trim(requested_shipping_state), '') is null then
    raise exception 'State is required.';
  end if;

  if nullif(trim(requested_shipping_zip), '') is null then
    raise exception 'ZIP is required.';
  end if;

  if nullif(trim(requested_pet_name), '') is null then
    raise exception 'Pet name is required.';
  end if;

  if nullif(trim(requested_pet_photo_data_url), '') is null then
    raise exception 'Pet photo is required.';
  end if;

  if requested_payment_status not in (
    'pending_payment',
    'payment_submitted',
    'payment_verified'
  ) then
    raise exception 'Invalid payment status.';
  end if;

  select payment_method
  into next_payment_method
  from public.guardian_orders
  where payment_method is not null
  order by created_at desc
  limit 1;

  if next_payment_method is null then
    raise exception
      'No existing valid Guardian payment method could be found.';
  end if;

  next_order_id :=
    'GPT-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  next_access_token := gen_random_uuid();

  next_payment_marked :=
    requested_payment_status in (
      'payment_submitted',
      'payment_verified'
    );

  insert into public.guardian_orders (
    order_id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    shipping_city,
    shipping_state,
    shipping_zip,
    payment_method,
    payment_amount,
    payment_memo,
    pet_count,
    setup_total,
    monthly_total,
    pets,
    status,
    payment_marked,
    customer_access_token,
    payment_submitted_at,
    payment_verified_at,
    fulfillment_updated_at
  )
  values (
    next_order_id,
    trim(requested_customer_name),
    trim(requested_customer_email),
    nullif(trim(requested_customer_phone), ''),
    trim(requested_shipping_address),
    trim(requested_shipping_city),
    trim(requested_shipping_state),
    trim(requested_shipping_zip),
    next_payment_method,
    25,
    next_order_id || ' · In-person Guardian Pet Tag order',
    1,
    25,
    5,
    jsonb_build_array(
      jsonb_build_object(
        'name', trim(requested_pet_name),
        'type', nullif(trim(requested_pet_type), ''),
        'breed', nullif(trim(requested_pet_breed), ''),
        'age', nullif(trim(requested_pet_age), ''),
        'color', nullif(trim(requested_pet_color), ''),
        'notes', nullif(trim(requested_pet_notes), ''),
        'photoDataUrl', trim(requested_pet_photo_data_url)
      )
    ),
    requested_payment_status,
    next_payment_marked,
    next_access_token,
    case
      when requested_payment_status in (
        'payment_submitted',
        'payment_verified'
      )
        then now()
      else null
    end,
    case
      when requested_payment_status = 'payment_verified'
        then now()
      else null
    end,
    now()
  )
  returning *
  into created_order;

  insert into public.guardian_order_activity (
    order_id,
    event_type,
    title,
    detail,
    created_by
  )
  values (
    created_order.order_id,
    'order_created_in_person',
    'In-person order created',
    'The Guardian Pet Tag order was created by an authorized operator.',
    auth.uid()
  );

  if requested_payment_status = 'payment_submitted' then
    insert into public.guardian_order_activity (
      order_id,
      event_type,
      title,
      detail,
      created_by
    )
    values (
      created_order.order_id,
      'payment_submitted',
      'Payment submitted',
      'The customer submitted payment during the in-person order.',
      auth.uid()
    );
  end if;

  if requested_payment_status = 'payment_verified' then
    insert into public.guardian_order_activity (
      order_id,
      event_type,
      title,
      detail,
      created_by
    )
    values (
      created_order.order_id,
      'payment_verified',
      'Payment verified',
      'Payment was received and verified during the in-person order.',
      auth.uid()
    );
  end if;

  return created_order;
end;
$$;

revoke all on function public.create_guardian_in_person_order(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
from public;

grant execute on function public.create_guardian_in_person_order(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
to authenticated;
