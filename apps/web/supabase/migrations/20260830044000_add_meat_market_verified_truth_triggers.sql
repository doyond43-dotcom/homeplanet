create or replace function public.record_meat_market_buyer_request_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if
    new.board_slug = 'okeechobee-live-meat-market'
    and new.selected_operation = 'Okeechobee Live Meat Market Buyer Request'
  then
    insert into public.okeechobee_meat_market_events (
      event_type,
      source,
      payload,
      verified,
      created_at
    )
    values (
      'buyer_request',
      'Buyer Request',
      jsonb_build_object(
        'buyer_request_id', new.id
      ),
      true,
      coalesce(new.created_at, now())
    );
  end if;

  return new;
end;
$$;

drop trigger if exists
  trg_record_meat_market_buyer_request_event
  on public.homeplanet_leads;

create trigger
  trg_record_meat_market_buyer_request_event
after insert
on public.homeplanet_leads
for each row
execute function public.record_meat_market_buyer_request_event();


create or replace function public.record_meat_market_seller_match_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $
declare
  canonical_seller_slug text;
begin
  if
    new.status = 'seller_found'
    and new.matched_seller_listing_id is not null
    and (
      tg_op = 'INSERT'
      or old.status is distinct from new.status
      or old.matched_seller_listing_id is distinct from new.matched_seller_listing_id
    )
  then
    select s.slug
    into canonical_seller_slug
    from public.okeechobee_meat_market_sellers s
    where
      s.slug = new.matched_seller_listing_id
      or s.source_event_id::text = new.matched_seller_listing_id
    limit 1;

    if canonical_seller_slug is null then
      select s.slug
      into canonical_seller_slug
      from public.okeechobee_events e
      join public.okeechobee_meat_market_sellers s
        on s.source_event_id = e.id
      where e.slug = new.matched_seller_listing_id
      limit 1;
    end if;

    insert into public.okeechobee_meat_market_events (
      event_type,
      seller_slug,
      source,
      payload,
      verified
    )
    values (
      'seller_match',
      coalesce(
        canonical_seller_slug,
        new.matched_seller_listing_id
      ),
      'Buyer Workflow',
      jsonb_build_object(
        'buyer_request_id', new.buyer_request_id,
        'matched_seller_listing_id', new.matched_seller_listing_id,
        'matched_seller_name', new.matched_seller_name
      ),
      true
    );
  end if;

  return new;
end;
$;

drop trigger if exists
  trg_record_meat_market_seller_match_event
  on public.okeechobee_meat_market_buyer_workflow;

create trigger
  trg_record_meat_market_seller_match_event
after insert or update
on public.okeechobee_meat_market_buyer_workflow
for each row
execute function public.record_meat_market_seller_match_event();
