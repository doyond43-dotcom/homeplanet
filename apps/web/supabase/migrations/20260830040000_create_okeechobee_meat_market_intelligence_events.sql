create table if not exists public.okeechobee_meat_market_events (
  id uuid primary key default gen_random_uuid(),

  page text not null default 'okeechobee-live-meat-market',
  event_type text not null,

  session_id text null,

  seller_id uuid null
    references public.okeechobee_meat_market_sellers(id)
    on delete set null,

  seller_slug text null,

  product_id uuid null
    references public.okeechobee_meat_market_products(id)
    on delete set null,

  product_name text null,

  source text null,
  destination text null,
  referrer text null,

  payload jsonb not null default '{}'::jsonb,

  verified boolean not null default false,

  created_at timestamptz not null default now()
);

create index if not exists okeechobee_meat_market_events_created_at_idx
  on public.okeechobee_meat_market_events(created_at desc);

create index if not exists okeechobee_meat_market_events_type_idx
  on public.okeechobee_meat_market_events(event_type);

create index if not exists okeechobee_meat_market_events_seller_idx
  on public.okeechobee_meat_market_events(
    seller_slug,
    created_at desc
  );

create index if not exists okeechobee_meat_market_events_product_idx
  on public.okeechobee_meat_market_events(
    product_id,
    created_at desc
  );

alter table public.okeechobee_meat_market_events
  enable row level security;

drop policy if exists
  "Public can record Meat Market analytics"
  on public.okeechobee_meat_market_events;

create policy
  "Public can record Meat Market analytics"
  on public.okeechobee_meat_market_events
  for insert
  to anon, authenticated
  with check (
    verified = false
    and event_type in (
      'market_view',
      'seller_view',
      'product_order_click',
      'seller_link_click'
    )
  );

drop policy if exists
  "Authenticated users can read Meat Market analytics"
  on public.okeechobee_meat_market_events;

create policy
  "Authenticated users can read Meat Market analytics"
  on public.okeechobee_meat_market_events
  for select
  to authenticated
  using (true);

grant insert
  on public.okeechobee_meat_market_events
  to anon, authenticated;

grant select
  on public.okeechobee_meat_market_events
  to authenticated;
