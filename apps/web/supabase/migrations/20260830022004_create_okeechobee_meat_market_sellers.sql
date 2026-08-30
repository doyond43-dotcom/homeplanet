create table if not exists public.okeechobee_meat_market_sellers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  seller_name text not null,
  source_event_id uuid unique references public.okeechobee_events(id) on delete set null,
  location text,
  status text not null default 'Active' check (status in ('Active','Paused','Archived')),
  verified boolean not null default false,
  hero_image text,
  owner_image text,
  tagline text,
  website text,
  catalog_url text,
  catalog_label text,
  fulfillment text,
  product_image_map jsonb not null default '{}'::jsonb,
  featured_tier text not null default 'regular' check (featured_tier in ('regular','shared','dedicated')),
  featured_status text not null default 'inactive' check (featured_status in ('inactive','active','paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists okeechobee_meat_market_sellers_status_idx
  on public.okeechobee_meat_market_sellers(status);

create index if not exists okeechobee_meat_market_sellers_featured_idx
  on public.okeechobee_meat_market_sellers(featured_status, featured_tier);

alter table public.okeechobee_meat_market_sellers enable row level security;

drop policy if exists "Public can read active Meat Market sellers"
  on public.okeechobee_meat_market_sellers;

create policy "Public can read active Meat Market sellers"
  on public.okeechobee_meat_market_sellers
  for select
  to anon, authenticated
  using (status = 'Active');

insert into public.okeechobee_meat_market_sellers (
  slug,
  seller_name,
  source_event_id,
  location,
  status,
  verified,
  hero_image,
  owner_image,
  tagline,
  website,
  catalog_url,
  catalog_label,
  fulfillment,
  product_image_map
)
select
  'farm-folks',
  'Farm Folks LLC',
  e.id,
  coalesce(nullif(e.location, ''), 'Okeechobee'),
  'Active',
  true,
  '/images/farm-folks-beef-patties.jpg',
  '/images/farm-folks-owner.jpg',
  'From their farm to your table.',
  'https://farmfolksllc.com',
  null,
  null,
  'Pickup',
  jsonb_build_object(
    'ancestral', '/images/farm-folks-ancestral-blend.jpg',
    'beef patties', '/images/farm-folks-beef-patties.jpg',
    'patties', '/images/farm-folks-beef-patties.jpg',
    'patty', '/images/farm-folks-beef-patties.jpg',
    'ground beef', '/images/farm-folks-beef-patties.jpg',
    'hamburger', '/images/farm-folks-ground-beef.jpg',
    'kefir', '/images/farm-folks-kefir.jpg',
    'raw milk', '/images/farm-folks-raw-milk.jpg',
    'raw dairy', '/images/farm-folks-raw-milk.jpg',
    'milk', '/images/farm-folks-raw-milk.jpg',
    'egg', '/images/farm-folks-eggs.jpg',
    'honey', '/images/farm-folks-honey.jpg',
    'steak', '/images/farm-folks-steaks.jpg',
    'ribeye', '/images/farm-folks-steaks.jpg',
    'sirloin', '/images/farm-folks-steaks.jpg',
    'filet', '/images/farm-folks-steaks.jpg',
    'beef', '/images/farm-folks-beef-cuts.jpg'
  )
from public.okeechobee_events e
where e.type = 'Live Meat Market Seller'
  and lower(e.title) = lower('Live Meat Market Seller: Farm Folks LLC')
order by e.created_at desc
limit 1
on conflict (slug) do update set
  seller_name = excluded.seller_name,
  source_event_id = excluded.source_event_id,
  location = excluded.location,
  status = excluded.status,
  verified = excluded.verified,
  hero_image = excluded.hero_image,
  owner_image = excluded.owner_image,
  tagline = excluded.tagline,
  website = excluded.website,
  fulfillment = excluded.fulfillment,
  product_image_map = excluded.product_image_map,
  updated_at = now();

insert into public.okeechobee_meat_market_sellers (
  slug,
  seller_name,
  source_event_id,
  location,
  status,
  verified,
  hero_image,
  tagline,
  website,
  catalog_url,
  catalog_label,
  fulfillment,
  product_image_map
)
select
  'lollis-beef',
  'Lollis Beef',
  e.id,
  coalesce(nullif(e.location, ''), 'Okeechobee'),
  'Active',
  true,
  '/images/lollis-beef-main.jpg',
  'Local beef, pork, and more from Lollis Beef.',
  'https://lollisbeef.com',
  'https://lollisbeef.com/collections',
  'Shop Current Products',
  'Pickup',
  jsonb_build_object(
    'steak', '/images/lollis-beef-main.jpg',
    'beef', '/images/lollis-beef-main.jpg',
    'rib', '/images/lollis-beef-main.jpg',
    'ground', '/images/lollis-beef-main.jpg',
    'pork', '/images/lollis-beef-main.jpg'
  )
from public.okeechobee_events e
where e.type = 'Live Meat Market Seller'
  and lower(e.title) = lower('Live Meat Market Seller: Lollis Beef')
order by e.created_at desc
limit 1
on conflict (slug) do update set
  seller_name = excluded.seller_name,
  source_event_id = excluded.source_event_id,
  location = excluded.location,
  status = excluded.status,
  verified = excluded.verified,
  hero_image = excluded.hero_image,
  tagline = excluded.tagline,
  website = excluded.website,
  catalog_url = excluded.catalog_url,
  catalog_label = excluded.catalog_label,
  fulfillment = excluded.fulfillment,
  product_image_map = excluded.product_image_map,
  updated_at = now();
