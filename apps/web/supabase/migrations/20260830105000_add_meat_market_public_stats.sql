create or replace function public.okeechobee_meat_market_public_stats()
returns table (
  market_views bigint,
  unique_shoppers bigint,
  buyer_requests bigint,
  seller_matches bigint
)
language sql
security definer
set search_path = public
as $$
  with market_view_events as (
    select
      e.created_at,
      lag(e.created_at) over (
        partition by
          coalesce(e.session_id, 'anonymous'),
          e.event_type,
          coalesce(e.seller_slug, 'market')
        order by e.created_at
      ) as previous_created_at
    from public.okeechobee_meat_market_events e
    where e.event_type = 'market_view'
  ),
  buyer_rows as (
    select l.id
    from public.homeplanet_leads l
    where l.board_slug = 'okeechobee-live-meat-market'
      and l.selected_operation = 'Okeechobee Live Meat Market Buyer Request'
  )
  select
    (
      select count(*)
      from market_view_events
      where previous_created_at is null
         or created_at - previous_created_at >= interval '2 seconds'
    )::bigint as market_views,

    (
      select count(distinct e.session_id)
      from public.okeechobee_meat_market_events e
      where e.session_id is not null
    )::bigint as unique_shoppers,

    (
      select count(*)
      from buyer_rows
    )::bigint as buyer_requests,

    (
      select count(*)
      from buyer_rows b
      join public.okeechobee_meat_market_buyer_workflow w
        on w.buyer_request_id = b.id
      where lower(coalesce(w.status, '')) in (
        'seller_found',
        'buyer_contacted',
        'complete'
      )
    )::bigint as seller_matches;
$$;

revoke all
on function public.okeechobee_meat_market_public_stats()
from public;

grant execute
on function public.okeechobee_meat_market_public_stats()
to anon, authenticated;