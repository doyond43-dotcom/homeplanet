update public.okeechobee_meat_market_sellers
set
  catalog_url = 'https://farmfolksllc.com/products/',
  catalog_label = 'Shop Current Products',
  updated_at = now()
where slug = 'farm-folks';
