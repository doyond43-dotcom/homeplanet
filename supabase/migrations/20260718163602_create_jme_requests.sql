create table if not exists public.jme_requests (
    id uuid primary key default gen_random_uuid(),

    request_type text not null
        check (request_type in ('rental', 'repair')),

    status text not null default 'new'
        check (
            status in (
                'new',
                'reviewing',
                'approved',
                'scheduled',
                'in_progress',
                'awaiting_payment',
                'paid',
                'completed',
                'declined',
                'cancelled'
            )
        ),

    customer_name text not null,
    customer_phone text not null,

    equipment text not null,
    brand_model text,

    requested_start_date date,
    requested_return_date date,
    movement_preference text,
    project_details text,
    project_location text,

    problem_description text,
    equipment_condition text,
    service_preference text,
    equipment_location text,
    photo_names text[] not null default '{}',

    source text not null default 'jme_live_page',

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists
    jme_requests_status_idx
on public.jme_requests (status);

create index if not exists
    jme_requests_type_idx
on public.jme_requests (request_type);

create index if not exists
    jme_requests_created_at_idx
on public.jme_requests (created_at desc);

alter table public.jme_requests
    enable row level security;

drop policy if exists
    "Public can create JME requests"
on public.jme_requests;

create policy
    "Public can create JME requests"
on public.jme_requests
for insert
to anon, authenticated
with check (
    request_type in ('rental', 'repair')
    and status = 'new'
    and source = 'jme_live_page'
);

comment on table public.jme_requests is
    'Customer rental and equipment repair requests submitted through the Jones Equipment Rental & Repair HomePlanet live system.';