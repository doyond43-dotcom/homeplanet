alter table public.okeechobee_meat_market_products
  add column if not exists market_marker text,
  add column if not exists quantity_available text,
  add column if not exists pickup_timing text;
