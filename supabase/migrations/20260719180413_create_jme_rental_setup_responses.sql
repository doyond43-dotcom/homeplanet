create table if not exists public.jme_rental_setup_responses (
    id uuid primary key default gen_random_uuid(),
    equipment_status jsonb not null default '{}'::jsonb,
    rental_periods text[] not null default '{}',
    rental_period_notes text,
    pickup_delivery text[] not null default '{}',
    delivery_pricing_method text,
    delivery_notes text,
    deposit_requirement text,
    agreement_required text,
    bobcat_attachments text[] not null default '{}',
    attachment_notes text,
    additional_notes text,
    created_at timestamptz not null default now()
);

alter table public.jme_rental_setup_responses
enable row level security;

drop policy if exists
"Public can submit JME rental setup"
on public.jme_rental_setup_responses;

create policy
"Public can submit JME rental setup"
on public.jme_rental_setup_responses
for insert
to anon, authenticated
with check (true);

revoke all
on table public.jme_rental_setup_responses
from anon, authenticated;

grant insert
on table public.jme_rental_setup_responses
to anon, authenticated;