update public.okeechobee_meat_market_products
set external_order_url = 'https://app.barn2door.com/farmfolksllc/all/qORGW'
where seller_listing_id = 'farm-folks'
  and lower(name) = lower('Raw Dairy');
