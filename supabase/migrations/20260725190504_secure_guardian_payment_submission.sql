-- Track and secure the public Pet Tag payment-submission transition.
-- Customers may only mark an existing pending order as payment submitted
-- when both the order ID and customer email match.

alter table public.guardian_orders
  add column if not exists payment_submitted_at timestamptz;

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
  updated_count integer;
begin
  update public.guardian_orders
  set
    status = 'payment_submitted',
    payment_marked = true,
    payment_submitted_at = now()
  where order_id = trim(submitted_order_id)
    and lower(customer_email) = lower(trim(submitted_customer_email))
    and status = 'pending_payment'
    and coalesce(payment_marked, false) = false;

  get diagnostics updated_count = row_count;

  return updated_count = 1;
end;
$$;

revoke all on function public.submit_guardian_order_payment(text, text)
  from public;

grant execute on function public.submit_guardian_order_payment(text, text)
  to anon, authenticated;

comment on function public.submit_guardian_order_payment(text, text) is
'Allows a Pet Tag customer to move only their matching pending order into payment-submitted status. The function does not expose or permit arbitrary guardian_orders updates.';