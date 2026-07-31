begin;

alter table public.hp_events enable row level security;

grant insert on table public.hp_events to anon, authenticated;

drop policy if exists "Visitors can record Only The Essentials activity"
on public.hp_events;

create policy "Visitors can record Only The Essentials activity"
on public.hp_events
for insert
to anon, authenticated
with check (
  board = 'only-the-essentials'
  and event in (
    'landing_page_opened',
    'quote_started',
    'quote_request_submitted',
    'call_clicked',
    'text_clicked',
    'request_cleaning_clicked',
    'video_played'
  )
  and entity_id is null
  and jsonb_typeof(coalesce(meta, '{}'::jsonb)) = 'object'
  and meta ->> 'source' = 'OnlyTheEssentialsLandingV2'
);

commit;
