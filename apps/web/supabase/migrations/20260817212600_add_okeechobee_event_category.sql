alter table public.okeechobee_events
  add column if not exists category text;

update public.okeechobee_events
set category = trim(
  substring(description from 'Category:[[:space:]]*([^\r\n]+)')
)
where category is null
  and description like '%Category:%';
