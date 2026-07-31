begin;

alter table public.cow_town_ranches
  add column if not exists management_access_token uuid
  not null default gen_random_uuid();

create unique index if not exists cow_town_ranches_management_token_idx
  on public.cow_town_ranches(management_access_token);

create table if not exists public.cow_town_ownership_transfers (
  id uuid primary key default gen_random_uuid(),

  animal_id uuid not null
    references public.cow_town_animals(id) on delete restrict,

  from_ranch_id uuid not null
    references public.cow_town_ranches(id) on delete restrict,

  to_ranch_id uuid
    references public.cow_town_ranches(id) on delete restrict,

  acceptance_token uuid not null unique default gen_random_uuid(),

  buyer_ranch_name text not null,
  buyer_contact_name text not null,
  buyer_email text not null,
  buyer_phone text not null,

  transfer_method text not null
    check (
      transfer_method in (
        'livestock-auction',
        'private-sale',
        'ranch-transfer',
        'inheritance',
        'other'
      )
    ),

  auction_name text,
  auction_lot_number text,
  transfer_notes text,

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'accepted',
        'rejected',
        'cancelled',
        'expired'
      )
    ),

  initiated_at timestamptz not null default now(),
  accepted_at timestamptz,
  rejected_at timestamptz,
  cancelled_at timestamptz,
  expires_at timestamptz not null default (now() + interval '30 days'),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cow_town_animal_ownership (
  id uuid primary key default gen_random_uuid(),

  animal_id uuid not null
    references public.cow_town_animals(id) on delete restrict,

  ranch_id uuid not null
    references public.cow_town_ranches(id) on delete restrict,

  source_transfer_id uuid
    references public.cow_town_ownership_transfers(id) on delete set null,

  acquisition_method text not null default 'initial-registration'
    check (
      acquisition_method in (
        'initial-registration',
        'livestock-auction',
        'private-sale',
        'ranch-transfer',
        'inheritance',
        'other'
      )
    ),

  started_at timestamptz not null default now(),
  ended_at timestamptz,

  is_current boolean not null default true,

  created_at timestamptz not null default now()
);

create unique index if not exists cow_town_one_current_owner_per_animal_idx
  on public.cow_town_animal_ownership(animal_id)
  where is_current = true;

create index if not exists cow_town_ownership_animal_idx
  on public.cow_town_animal_ownership(animal_id);

create index if not exists cow_town_ownership_ranch_idx
  on public.cow_town_animal_ownership(ranch_id);

create index if not exists cow_town_transfers_animal_idx
  on public.cow_town_ownership_transfers(animal_id);

create index if not exists cow_town_transfers_from_ranch_idx
  on public.cow_town_ownership_transfers(from_ranch_id);

create index if not exists cow_town_transfers_status_idx
  on public.cow_town_ownership_transfers(status);

insert into public.cow_town_animal_ownership (
  animal_id,
  ranch_id,
  acquisition_method,
  started_at,
  is_current
)
select
  animal.id,
  animal.ranch_id,
  'initial-registration',
  animal.created_at,
  true
from public.cow_town_animals animal
where not exists (
  select 1
  from public.cow_town_animal_ownership ownership
  where ownership.animal_id = animal.id
    and ownership.is_current = true
);

alter table public.cow_town_ownership_transfers
  enable row level security;

alter table public.cow_town_animal_ownership
  enable row level security;

revoke all on public.cow_town_ownership_transfers
  from anon, authenticated;

revoke all on public.cow_town_animal_ownership
  from anon, authenticated;

create or replace function public.initiate_cow_town_ownership_transfer(
  requested_management_token uuid,
  requested_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_animal_id uuid;
  v_from_ranch_id uuid;
  v_transfer_id uuid;
  v_acceptance_token uuid;
  v_expires_at timestamptz;

  v_cow_town_id text;
  v_buyer_ranch_name text;
  v_buyer_contact_name text;
  v_buyer_email text;
  v_buyer_phone text;
  v_transfer_method text;
  v_auction_name text;
  v_auction_lot_number text;
  v_transfer_notes text;
begin
  if requested_management_token is null then
    raise exception 'A ranch management token is required.';
  end if;

  if requested_payload is null then
    raise exception 'Transfer information is required.';
  end if;

  v_cow_town_id :=
    upper(nullif(trim(requested_payload ->> 'cow_town_id'), ''));

  v_buyer_ranch_name :=
    nullif(trim(requested_payload ->> 'buyer_ranch_name'), '');

  v_buyer_contact_name :=
    nullif(trim(requested_payload ->> 'buyer_contact_name'), '');

  v_buyer_email :=
    lower(nullif(trim(requested_payload ->> 'buyer_email'), ''));

  v_buyer_phone :=
    nullif(trim(requested_payload ->> 'buyer_phone'), '');

  v_transfer_method :=
    nullif(trim(requested_payload ->> 'transfer_method'), '');

  v_auction_name :=
    nullif(trim(requested_payload ->> 'auction_name'), '');

  v_auction_lot_number :=
    nullif(trim(requested_payload ->> 'auction_lot_number'), '');

  v_transfer_notes :=
    nullif(trim(requested_payload ->> 'transfer_notes'), '');

  if v_cow_town_id is null
     or v_buyer_ranch_name is null
     or v_buyer_contact_name is null
     or v_buyer_email is null
     or v_buyer_phone is null then
    raise exception 'Complete the animal and buyer information.';
  end if;

  if v_transfer_method not in (
    'livestock-auction',
    'private-sale',
    'ranch-transfer',
    'inheritance',
    'other'
  ) then
    raise exception 'Choose a valid transfer method.';
  end if;

  if v_transfer_method = 'livestock-auction'
     and v_auction_name is null then
    raise exception 'Enter the livestock auction name.';
  end if;

  select
    animal.id,
    animal.ranch_id
  into
    v_animal_id,
    v_from_ranch_id
  from public.cow_town_animals animal
  join public.cow_town_ranches ranch
    on ranch.id = animal.ranch_id
  where animal.cow_town_id = v_cow_town_id
    and ranch.management_access_token = requested_management_token
  limit 1;

  if not found then
    raise exception 'Animal not found or ranch access was not verified.';
  end if;

  if exists (
    select 1
    from public.cow_town_ownership_transfers transfer
    where transfer.animal_id = v_animal_id
      and transfer.status = 'pending'
      and transfer.expires_at > now()
  ) then
    raise exception 'This animal already has a pending ownership transfer.';
  end if;

  insert into public.cow_town_animal_ownership (
    animal_id,
    ranch_id,
    acquisition_method,
    started_at,
    is_current
  )
  select
    v_animal_id,
    v_from_ranch_id,
    'initial-registration',
    now(),
    true
  where not exists (
    select 1
    from public.cow_town_animal_ownership ownership
    where ownership.animal_id = v_animal_id
      and ownership.is_current = true
  );

  insert into public.cow_town_ownership_transfers (
    animal_id,
    from_ranch_id,
    buyer_ranch_name,
    buyer_contact_name,
    buyer_email,
    buyer_phone,
    transfer_method,
    auction_name,
    auction_lot_number,
    transfer_notes
  )
  values (
    v_animal_id,
    v_from_ranch_id,
    v_buyer_ranch_name,
    v_buyer_contact_name,
    v_buyer_email,
    v_buyer_phone,
    v_transfer_method,
    v_auction_name,
    v_auction_lot_number,
    v_transfer_notes
  )
  returning
    id,
    acceptance_token,
    expires_at
  into
    v_transfer_id,
    v_acceptance_token,
    v_expires_at;

  insert into public.cow_town_activity (
    ranch_id,
    animal_id,
    activity_type,
    title,
    detail,
    metadata
  )
  values (
    v_from_ranch_id,
    v_animal_id,
    'ownership_transfer_started',
    'Ownership transfer started',
    'The current ranch started a verified ownership transfer.',
    jsonb_build_object(
      'transfer_id', v_transfer_id,
      'transfer_method', v_transfer_method,
      'auction_name', v_auction_name,
      'auction_lot_number', v_auction_lot_number,
      'expires_at', v_expires_at
    )
  );

  return jsonb_build_object(
    'transfer_id', v_transfer_id,
    'acceptance_token', v_acceptance_token,
    'status', 'pending',
    'expires_at', v_expires_at,
    'accept_path',
      '/planet/cow-town-tags/transfer/accept/' ||
      v_acceptance_token::text
  );
end;
$$;

revoke all on function public.initiate_cow_town_ownership_transfer(
  uuid,
  jsonb
) from public;

grant execute on function public.initiate_cow_town_ownership_transfer(
  uuid,
  jsonb
) to anon, authenticated;

create or replace function public.accept_cow_town_ownership_transfer(
  requested_acceptance_token uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_transfer public.cow_town_ownership_transfers%rowtype;
  v_new_ranch_id uuid;
  v_new_management_token uuid;
  v_cow_town_id text;
begin
  if requested_acceptance_token is null then
    raise exception 'A transfer acceptance token is required.';
  end if;

  select *
  into v_transfer
  from public.cow_town_ownership_transfers
  where acceptance_token = requested_acceptance_token
  for update;

  if not found then
    raise exception 'Ownership transfer not found.';
  end if;

  if v_transfer.status <> 'pending' then
    raise exception 'This ownership transfer is no longer pending.';
  end if;

  if v_transfer.expires_at <= now() then
    update public.cow_town_ownership_transfers
    set
      status = 'expired',
      updated_at = now()
    where id = v_transfer.id;

    raise exception 'This ownership transfer has expired.';
  end if;

  select cow_town_id
  into v_cow_town_id
  from public.cow_town_animals
  where id = v_transfer.animal_id;

  insert into public.cow_town_ranches (
    ranch_name,
    primary_contact_name,
    primary_phone,
    primary_email,
    recovery_phone,
    status
  )
  values (
    v_transfer.buyer_ranch_name,
    v_transfer.buyer_contact_name,
    v_transfer.buyer_phone,
    v_transfer.buyer_email,
    v_transfer.buyer_phone,
    'active'
  )
  returning
    id,
    management_access_token
  into
    v_new_ranch_id,
    v_new_management_token;

  update public.cow_town_animal_ownership
  set
    is_current = false,
    ended_at = now()
  where animal_id = v_transfer.animal_id
    and is_current = true;

  insert into public.cow_town_animal_ownership (
    animal_id,
    ranch_id,
    source_transfer_id,
    acquisition_method,
    started_at,
    is_current
  )
  values (
    v_transfer.animal_id,
    v_new_ranch_id,
    v_transfer.id,
    v_transfer.transfer_method,
    now(),
    true
  );

  update public.cow_town_animals
  set
    ranch_id = v_new_ranch_id,
    animal_status = 'active',
    updated_at = now()
  where id = v_transfer.animal_id;

  update public.cow_town_ownership_transfers
  set
    to_ranch_id = v_new_ranch_id,
    status = 'accepted',
    accepted_at = now(),
    updated_at = now()
  where id = v_transfer.id;

  insert into public.cow_town_activity (
    ranch_id,
    animal_id,
    activity_type,
    title,
    detail,
    metadata
  )
  values (
    v_transfer.from_ranch_id,
    v_transfer.animal_id,
    'ownership_transfer_completed',
    'Ownership transfer completed',
    'The buyer accepted the animal ownership transfer.',
    jsonb_build_object(
      'transfer_id', v_transfer.id,
      'new_ranch_id', v_new_ranch_id,
      'transfer_method', v_transfer.transfer_method,
      'accepted_at', now()
    )
  );

  insert into public.cow_town_activity (
    ranch_id,
    animal_id,
    activity_type,
    title,
    detail,
    metadata
  )
  values (
    v_new_ranch_id,
    v_transfer.animal_id,
    'animal_received',
    'Animal ownership received',
    'This ranch accepted ownership of the animal.',
    jsonb_build_object(
      'transfer_id', v_transfer.id,
      'previous_ranch_id', v_transfer.from_ranch_id,
      'transfer_method', v_transfer.transfer_method,
      'accepted_at', now()
    )
  );

  return jsonb_build_object(
    'transfer_id', v_transfer.id,
    'status', 'accepted',
    'cow_town_id', v_cow_town_id,
    'new_ranch_id', v_new_ranch_id,
    'management_access_token', v_new_management_token
  );
end;
$$;

revoke all on function public.accept_cow_town_ownership_transfer(uuid)
  from public;

grant execute on function public.accept_cow_town_ownership_transfer(uuid)
  to anon, authenticated;

commit;
