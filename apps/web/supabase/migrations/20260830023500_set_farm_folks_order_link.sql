update public.okeechobee_meat_market_sellers
set
  catalog_url = 'https://farmfolksllc.com',
  catalog_label = 'Shop / Order From Seller',
  updated_at = now()
where slug = 'farm-folks';
