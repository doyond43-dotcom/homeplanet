-- HomePlanet Okeechobee Live Meat Market
-- Atomic seller product deactivation
-- Server-side use only. Does not permanently delete products.

create function public.meat_market_deactivate_seller_product(
    p_seller_listing_id text,
    p_product_id uuid
)
returns text
language plpgsql
security invoker
set search_path = ''
as $function$
declare
    v_active_count bigint;
begin
    if p_seller_listing_id is null
       or btrim(p_seller_listing_id) = ''
       or p_product_id is null then
        return 'invalid_request';
    end if;

    -- Serialize deactivation operations for this seller.
    perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(
            'homeplanet:meat-market:deactivate:' ||
            p_seller_listing_id,
            0
        )
    );

    -- The product must be active and belong to this seller.
    perform 1
    from public.okeechobee_meat_market_products
    where id = p_product_id
      and seller_listing_id = p_seller_listing_id
      and status = 'Active';

    if not found then
        return 'not_found';
    end if;

    select count(*)
    into v_active_count
    from public.okeechobee_meat_market_products
    where seller_listing_id = p_seller_listing_id
      and status = 'Active';

    if v_active_count <= 1 then
        return 'last_active_product';
    end if;

    update public.okeechobee_meat_market_products
    set status = 'Inactive'
    where id = p_product_id
      and seller_listing_id = p_seller_listing_id
      and status = 'Active';

    if not found then
        return 'not_found';
    end if;

    return 'deactivated';
end;
$function$;

-- PostgreSQL grants function execution to PUBLIC by default.
-- Restrict this operation to the server's service role.
revoke all on function
    public.meat_market_deactivate_seller_product(text, uuid)
from public, anon, authenticated;

grant execute on function
    public.meat_market_deactivate_seller_product(text, uuid)
to service_role;