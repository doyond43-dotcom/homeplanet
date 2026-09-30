create table if not exists public.starter_system_subscriptions (
  live_page_slug text primary key
    references public.starter_live_pages(slug)
    on delete cascade,

  status text not null default 'approval_pending'
    check (
      status in (
        'trialing',
        'approval_pending',
        'active',
        'past_due',
        'suspended',
        'cancelled',
        'expired'
      )
    ),

  trial_started_at timestamptz null,
  trial_ends_at timestamptz null,

  monthly_price numeric(10,2) not null default 29.99,
  currency text not null default 'USD',

  paypal_plan_id text null,
  paypal_subscription_id text unique null,
  paypal_status text null,

  current_period_start timestamptz null,
  current_period_end timestamptz null,
  cancelled_at timestamptz null,
  last_payment_at timestamptz null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  paypal_environment text null,
  paypal_product_id text null
);

alter table public.starter_system_subscriptions
  enable row level security;

revoke all on table public.starter_system_subscriptions
  from anon, authenticated;

create or replace function public.ensure_starter_system_subscription(
  p_live_page_slug text,
  p_admin_access_token text
)
returns public.starter_system_subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  result_row public.starter_system_subscriptions;
begin
  if p_live_page_slug is null
     or btrim(p_live_page_slug) = ''
     or p_admin_access_token is null
     or btrim(p_admin_access_token) = ''
     or not exists (
       select 1
       from public.starter_notification_settings s
       where s.live_page_slug = p_live_page_slug
         and s.admin_access_token = p_admin_access_token
     )
  then
    raise exception 'Invalid admin access token';
  end if;

  insert into public.starter_system_subscriptions (
    live_page_slug,
    status,
    monthly_price,
    currency
  )
  values (
    p_live_page_slug,
    'approval_pending',
    29.99,
    'USD'
  )
  on conflict (live_page_slug) do nothing;

  select *
  into result_row
  from public.starter_system_subscriptions
  where live_page_slug = p_live_page_slug;

  return result_row;
end;
$$;

create or replace function public.get_starter_system_subscription(
  p_live_page_slug text,
  p_admin_access_token text
)
returns public.starter_system_subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  result_row public.starter_system_subscriptions;
begin
  if p_live_page_slug is null
     or btrim(p_live_page_slug) = ''
     or p_admin_access_token is null
     or btrim(p_admin_access_token) = ''
     or not exists (
       select 1
       from public.starter_notification_settings s
       where s.live_page_slug = p_live_page_slug
         and s.admin_access_token = p_admin_access_token
     )
  then
    raise exception 'Invalid admin access token';
  end if;

  select *
  into result_row
  from public.starter_system_subscriptions
  where live_page_slug = p_live_page_slug;

  return result_row;
end;
$$;

grant execute on function public.ensure_starter_system_subscription(text, text)
  to anon, authenticated;

grant execute on function public.get_starter_system_subscription(text, text)
  to anon, authenticated;
