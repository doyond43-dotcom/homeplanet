alter table public.okeechobee_meat_market_products
  add column if not exists category text,
  add column if not exists description text,
  add column if not exists image_url text,
  add column if not exists featured boolean not null default false;

create index if not exists
  okeechobee_meat_market_products_seller_featured_idx
on public.okeechobee_meat_market_products (
  seller_listing_id,
  featured,
  sort_order
);