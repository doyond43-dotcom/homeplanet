update public.okeechobee_meat_market_products
set external_order_url = case
  when lower(name) = lower('Beef Shares')
    then 'https://app.barn2door.com/farmfolksllc/all/Zm7yv'
  when lower(name) = lower('Raw Dairy')
    then 'https://app.barn2door.com/farmfolksllc/all?sellerSubCategories=46434&defaultCategories=6'
  else external_order_url
end
where seller_listing_id = 'farm-folks'
  and lower(name) in (
    lower('Beef Shares'),
    lower('Raw Dairy')
  );

update public.okeechobee_meat_market_sellers
set
  product_image_map =
    coalesce(product_image_map, '{}'::jsonb) ||
    jsonb_build_object(
      'ground beef',
      '/images/farm-folks-ground-beef.jpg'
    ),
  updated_at = now()
where slug = 'farm-folks';
