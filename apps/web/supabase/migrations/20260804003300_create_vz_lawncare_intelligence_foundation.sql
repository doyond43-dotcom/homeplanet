create table if not exists public.vz_lawncare_requests (
  id uuid primary key default gen_random_uuid(),
  business_slug text not null default 'vz-professional-lawncare',
  customer_name text not null,
  phone text,
  email text,
  service_needed text not null,
  property_location text,
  property_type text,
  yard_condition text,
  access_notes text,
  preferred_timing text,
  customer_notes text,
  request_status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint vz_lawncare_request_business_check
    check (business_slug = 'vz-professional-lawncare'),

  constraint vz_lawncare_request_status_check
    check (
      request_status in (
        'new',
        'reviewing',
        'estimate_sent',
        'approved',
        'scheduled',
        'in_progress',
        'completed',
        'closed'
      )
    )
);

create index if not exists vz_lawncare_requests_created_idx
on public.vz_lawncare_requests (
  created_at desc
);

create index if not exists vz_lawncare_requests_status_idx
on public.vz_lawncare_requests (
  request_status,
  created_at desc
);

alter table public.vz_lawncare_requests
enable row level security;

grant select, insert, update, delete
on table public.vz_lawncare_requests
to anon, authenticated;

drop policy if exists
  "VZ lawncare requests can be created"
on public.vz_lawncare_requests;

create policy
  "VZ lawncare requests can be created"
on public.vz_lawncare_requests
for insert
to anon, authenticated
with check (
  business_slug = 'vz-professional-lawncare'
  and length(trim(customer_name)) > 0
  and length(trim(service_needed)) > 0
);

drop policy if exists
  "VZ lawncare requests can be read"
on public.vz_lawncare_requests;

create policy
  "VZ lawncare requests can be read"
on public.vz_lawncare_requests
for select
to anon, authenticated
using (
  business_slug = 'vz-professional-lawncare'
);

drop policy if exists
  "VZ lawncare requests can be updated"
on public.vz_lawncare_requests;

create policy
  "VZ lawncare requests can be updated"
on public.vz_lawncare_requests
for update
to anon, authenticated
using (
  business_slug = 'vz-professional-lawncare'
)
with check (
  business_slug = 'vz-professional-lawncare'
);

drop policy if exists
  "VZ lawncare requests can be deleted"
on public.vz_lawncare_requests;

create policy
  "VZ lawncare requests can be deleted"
on public.vz_lawncare_requests
for delete
to anon, authenticated
using (
  business_slug = 'vz-professional-lawncare'
);


create table if not exists public.vz_lawncare_truth_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null
    references public.vz_lawncare_requests(id)
    on delete cascade,
  business_slug text not null default 'vz-professional-lawncare',
  event_type text not null,
  event_label text not null,
  event_detail text,
  event_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),

  constraint vz_lawncare_truth_business_check
    check (business_slug = 'vz-professional-lawncare'),

  constraint vz_lawncare_truth_event_type_check
    check (
      event_type in (
        'request_received',
        'estimate_sent',
        'customer_approved',
        'job_scheduled',
        'work_started',
        'before_photo_added',
        'work_completed',
        'after_photo_added',
        'payment_sent',
        'payment_received',
        'proof_sent',
        'review_requested',
        'outcome_closed'
      )
    ),

  constraint vz_lawncare_truth_meta_check
    check (jsonb_typeof(event_meta) = 'object')
);

create index if not exists vz_lawncare_truth_request_idx
on public.vz_lawncare_truth_events (
  request_id,
  created_at asc
);

create unique index if not exists vz_lawncare_truth_unique_request_event
on public.vz_lawncare_truth_events (
  request_id,
  event_type
);

alter table public.vz_lawncare_truth_events
enable row level security;

grant select, insert
on table public.vz_lawncare_truth_events
to anon, authenticated;

drop policy if exists
  "VZ lawncare truth events can be read"
on public.vz_lawncare_truth_events;

create policy
  "VZ lawncare truth events can be read"
on public.vz_lawncare_truth_events
for select
to anon, authenticated
using (
  business_slug = 'vz-professional-lawncare'
);

drop policy if exists
  "VZ lawncare truth events can be recorded"
on public.vz_lawncare_truth_events;

create policy
  "VZ lawncare truth events can be recorded"
on public.vz_lawncare_truth_events
for insert
to anon, authenticated
with check (
  business_slug = 'vz-professional-lawncare'
  and request_id is not null
  and jsonb_typeof(event_meta) = 'object'
);


create table if not exists public.vz_lawncare_request_photos (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null
    references public.vz_lawncare_requests(id)
    on delete cascade,
  business_slug text not null default 'vz-professional-lawncare',
  photo_type text not null,
  storage_path text not null,
  public_url text not null,
  created_at timestamptz not null default now(),

  constraint vz_lawncare_photo_business_check
    check (business_slug = 'vz-professional-lawncare'),

  constraint vz_lawncare_photo_type_check
    check (photo_type in ('before', 'after'))
);

create index if not exists vz_lawncare_photos_request_idx
on public.vz_lawncare_request_photos (
  request_id,
  created_at desc
);

alter table public.vz_lawncare_request_photos
enable row level security;

grant select, insert, delete
on table public.vz_lawncare_request_photos
to anon, authenticated;

drop policy if exists
  "VZ lawncare photos can be read"
on public.vz_lawncare_request_photos;

create policy
  "VZ lawncare photos can be read"
on public.vz_lawncare_request_photos
for select
to anon, authenticated
using (
  business_slug = 'vz-professional-lawncare'
);

drop policy if exists
  "VZ lawncare photos can be recorded"
on public.vz_lawncare_request_photos;

create policy
  "VZ lawncare photos can be recorded"
on public.vz_lawncare_request_photos
for insert
to anon, authenticated
with check (
  business_slug = 'vz-professional-lawncare'
  and request_id is not null
  and photo_type in ('before', 'after')
);

drop policy if exists
  "VZ lawncare photos can be deleted"
on public.vz_lawncare_request_photos;

create policy
  "VZ lawncare photos can be deleted"
on public.vz_lawncare_request_photos
for delete
to anon, authenticated
using (
  business_slug = 'vz-professional-lawncare'
);
