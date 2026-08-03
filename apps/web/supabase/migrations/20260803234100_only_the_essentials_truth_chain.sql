create table if not exists public.cleaning_request_truth_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  business_slug text not null default 'only-the-essentials',
  event_type text not null,
  event_label text not null,
  event_detail text,
  event_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),

  constraint cleaning_truth_business_check
    check (business_slug = 'only-the-essentials'),

  constraint cleaning_truth_event_type_check
    check (
      event_type in (
        'request_received',
        'request_reviewed',
        'estimate_sent',
        'agreement_sent',
        'customer_approved',
        'schedule_sent',
        'cleaning_scheduled',
        'before_photo_added',
        'work_started',
        'after_photo_added',
        'work_completed',
        'payment_sent',
        'payment_received',
        'proof_sent',
        'review_requested',
        'outcome_closed'
      )
    )
);

create index if not exists cleaning_request_truth_events_request_idx
on public.cleaning_request_truth_events (
  request_id,
  created_at asc
);

create unique index if not exists cleaning_truth_unique_request_event
on public.cleaning_request_truth_events (
  request_id,
  event_type
);

alter table public.cleaning_request_truth_events
enable row level security;

grant select, insert
on table public.cleaning_request_truth_events
to anon, authenticated;

drop policy if exists
  "Only The Essentials truth events can be read"
on public.cleaning_request_truth_events;

create policy
  "Only The Essentials truth events can be read"
on public.cleaning_request_truth_events
for select
to anon, authenticated
using (
  business_slug = 'only-the-essentials'
);

drop policy if exists
  "Only The Essentials truth events can be recorded"
on public.cleaning_request_truth_events;

create policy
  "Only The Essentials truth events can be recorded"
on public.cleaning_request_truth_events
for insert
to anon, authenticated
with check (
  business_slug = 'only-the-essentials'
  and request_id is not null
  and jsonb_typeof(event_meta) = 'object'
);
