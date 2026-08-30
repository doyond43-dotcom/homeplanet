alter table public.okeechobee_meat_market_products
add column if not exists external_order_url text;

update public.okeechobee_meat_market_products
set external_order_url = case
  when lower(name) = lower('Grass-Finished Ground Beef')
    then 'https://app.barn2door.com/farmfolksllc/all/RE4RA'
  when lower(name) = lower('Ancestral Blend')
    then 'https://app.barn2door.com/farmfolksllc/all/q46gy'
  when lower(name) = lower('Organic Corn/Soy-Free Eggs')
    then 'https://app.barn2door.com/farmfolksllc/all/Wgwz1'
  when lower(name) = lower('Raw Honey')
    then 'https://app.barn2door.com/farmfolksllc/all/GEnvj'
  else external_order_url
end
where seller_listing_id = 'farm-folks'
  and lower(name) in (
    lower('Grass-Finished Ground Beef'),
    lower('Ancestral Blend'),
    lower('Organic Corn/Soy-Free Eggs'),
    lower('Raw Honey')
  );
