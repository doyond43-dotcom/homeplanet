create extension if not exists pgcrypto;

create table if not exists public.guardian_pet_profiles (
  public_id text primary key,
  order_id text not null unique,
  owner_token text not null unique,

  pet_name text not null,
  pet_type text,
  breed text,
  age text,
  color text,
  photo_data_url text,

  owner_name text not null,
  call_number text,
  text_number text,

  temperament text,
  last_seen text,
  reward_text text,

  status text not null default 'safe'
    check (status in ('safe', 'missing', 'traveling')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guardian_pet_found_reports (
  id uuid primary key default gen_random_uuid(),
  pet_public_id text not null
    references public.guardian_pet_profiles(public_id)
    on delete cascade,

  situation text not null
    check (
      situation in (
        'safe-with-me',
        'seen-nearby',
        'appears-hurt'
      )
    ),

  finder_name text,
  callback_number text,
  found_location text not null,
  message text,

  created_at timestamptz not null default now()
);

alter table public.guardian_pet_profiles enable row level security;
alter table public.guardian_pet_found_reports enable row level security;

revoke all on public.guardian_pet_profiles from anon, authenticated;
revoke all on public.guardian_pet_found_reports from anon, authenticated;

create or replace function public.ensure_guardian_pet_profile(
  requested_order_id text
)
returns public.guardian_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  source_order public.guardian_orders;
  first_pet jsonb;
  generated_public_id text;
  generated_owner_token text;
  saved_profile public.guardian_pet_profiles;
begin
  if not public.is_guardian_operator() then
    raise exception 'Not authorized.';
  end if;

  select *
  into source_order
  from public.guardian_orders
  where order_id = trim(requested_order_id)
  for update;

  if source_order.order_id is null then
    raise exception 'Order not found.';
  end if;

  if source_order.status not in (
    'tag_activated',
    'ready_to_ship',
    'shipped',
    'delivered'
  ) then
    raise exception 'Activate the tag before creating the pet page.';
  end if;

  first_pet := coalesce(source_order.pets -> 0, '{}'::jsonb);

  select *
  into saved_profile
  from public.guardian_pet_profiles
  where order_id = source_order.order_id
  limit 1;

  if saved_profile.public_id is null then
    generated_public_id :=
      trim(
        both '-'
        from lower(
          regexp_replace(
            coalesce(source_order.order_id, gen_random_uuid()::text),
            '[^a-zA-Z0-9]+',
            '-',
            'g'
          )
        )
      );

    if generated_public_id = '' then
      generated_public_id :=
        left(replace(gen_random_uuid()::text, '-', ''), 16);
    end if;

    if exists (
      select 1
      from public.guardian_pet_profiles
      where public_id = generated_public_id
    ) then
      generated_public_id :=
        generated_public_id || '-' ||
        left(replace(gen_random_uuid()::text, '-', ''), 8);
    end if;

    generated_owner_token :=
      replace(gen_random_uuid()::text, '-', '') ||
      replace(gen_random_uuid()::text, '-', '');

    insert into public.guardian_pet_profiles (
      public_id,
      order_id,
      owner_token,
      pet_name,
      pet_type,
      breed,
      age,
      color,
      photo_data_url,
      owner_name,
      call_number,
      text_number,
      temperament,
      last_seen,
      reward_text,
      status
    )
    values (
      generated_public_id,
      source_order.order_id,
      generated_owner_token,
      coalesce(nullif(first_pet ->> 'name', ''), 'Pet'),
      nullif(first_pet ->> 'type', ''),
      nullif(first_pet ->> 'breed', ''),
      nullif(first_pet ->> 'age', ''),
      nullif(first_pet ->> 'color', ''),
      coalesce(
        nullif(first_pet ->> 'photoDataUrl', ''),
        nullif(first_pet ->> 'photoUrl', '')
      ),
      coalesce(nullif(source_order.customer_name, ''), 'Pet Owner'),
      nullif(source_order.customer_phone, ''),
      nullif(source_order.customer_phone, ''),
      coalesce(
        nullif(first_pet ->> 'notes', ''),
        'Please approach calmly and contact the owner.'
      ),
      '',
      '',
      'safe'
    )
    returning *
    into saved_profile;
  end if;

  update public.guardian_orders
  set pets =
    jsonb_set(
      jsonb_set(
        coalesce(pets, '[]'::jsonb),
        '{0,publicId}',
        to_jsonb(saved_profile.public_id),
        true
      ),
      '{0,ownerToken}',
      to_jsonb(saved_profile.owner_token),
      true
    )
  where order_id = source_order.order_id
  returning *
  into source_order;

  insert into public.guardian_order_activity (
    order_id,
    event_type,
    title,
    detail
  )
  values (
    source_order.order_id,
    'pet_profile_created',
    'Permanent Pet Tag page created',
    'The public QR page and private owner page are ready.'
  );

  return source_order;
end;
$$;

create or replace function public.get_guardian_pet_public(
  requested_public_id text
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'publicId', public_id,
    'name', pet_name,
    'type', pet_type,
    'breed', breed,
    'age', age,
    'color', color,
    'photoUrl', photo_data_url,
    'ownerName', owner_name,
    'callNumber', call_number,
    'textNumber', text_number,
    'temperament', temperament,
    'lastSeen', last_seen,
    'rewardText', reward_text,
    'status', status
  )
  from public.guardian_pet_profiles
  where public_id = trim(requested_public_id)
  limit 1;
$$;

create or replace function public.submit_guardian_pet_found_report(
  requested_public_id text,
  requested_situation text,
  requested_finder_name text default null,
  requested_callback_number text default null,
  requested_found_location text default null,
  requested_message text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  created_report public.guardian_pet_found_reports;
begin
  if requested_situation not in (
    'safe-with-me',
    'seen-nearby',
    'appears-hurt'
  ) then
    raise exception 'Choose what is happening with the pet.';
  end if;

  if nullif(trim(coalesce(requested_found_location, '')), '') is null then
    raise exception 'Enter where the pet was found or seen.';
  end if;

  insert into public.guardian_pet_found_reports (
    pet_public_id,
    situation,
    finder_name,
    callback_number,
    found_location,
    message
  )
  select
    profile.public_id,
    requested_situation,
    nullif(trim(coalesce(requested_finder_name, '')), ''),
    nullif(trim(coalesce(requested_callback_number, '')), ''),
    trim(requested_found_location),
    nullif(trim(coalesce(requested_message, '')), '')
  from public.guardian_pet_profiles profile
  where profile.public_id = trim(requested_public_id)
  returning *
  into created_report;

  if created_report.id is null then
    raise exception 'Pet profile not found.';
  end if;

  return jsonb_build_object(
    'success', true,
    'reportId', created_report.id
  );
end;
$$;

create or replace function public.get_guardian_pet_owner_profile(
  requested_owner_token text
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'publicId', public_id,
    'ownerToken', owner_token,
    'name', pet_name,
    'type', pet_type,
    'breed', breed,
    'age', age,
    'color', color,
    'photoUrl', photo_data_url,
    'ownerName', owner_name,
    'callNumber', call_number,
    'textNumber', text_number,
    'temperament', temperament,
    'lastSeen', last_seen,
    'rewardText', reward_text,
    'status', status
  )
  from public.guardian_pet_profiles
  where owner_token = trim(requested_owner_token)
  limit 1;
$$;

create or replace function public.update_guardian_pet_owner_profile(
  requested_owner_token text,
  requested_pet_name text,
  requested_pet_type text,
  requested_breed text,
  requested_age text,
  requested_color text,
  requested_photo_data_url text,
  requested_owner_name text,
  requested_call_number text,
  requested_text_number text,
  requested_temperament text,
  requested_last_seen text,
  requested_reward_text text,
  requested_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_profile public.guardian_pet_profiles;
begin
  if requested_status not in ('safe', 'missing', 'traveling') then
    raise exception 'Choose a valid pet status.';
  end if;

  if nullif(trim(coalesce(requested_pet_name, '')), '') is null then
    raise exception 'Pet name is required.';
  end if;

  update public.guardian_pet_profiles
  set
    pet_name = trim(requested_pet_name),
    pet_type = nullif(trim(coalesce(requested_pet_type, '')), ''),
    breed = nullif(trim(coalesce(requested_breed, '')), ''),
    age = nullif(trim(coalesce(requested_age, '')), ''),
    color = nullif(trim(coalesce(requested_color, '')), ''),
    photo_data_url = coalesce(
      nullif(requested_photo_data_url, ''),
      photo_data_url
    ),
    owner_name = coalesce(
      nullif(trim(coalesce(requested_owner_name, '')), ''),
      owner_name
    ),
    call_number = nullif(trim(coalesce(requested_call_number, '')), ''),
    text_number = nullif(trim(coalesce(requested_text_number, '')), ''),
    temperament = nullif(
      trim(coalesce(requested_temperament, '')),
      ''
    ),
    last_seen = nullif(trim(coalesce(requested_last_seen, '')), ''),
    reward_text = nullif(trim(coalesce(requested_reward_text, '')), ''),
    status = requested_status,
    updated_at = now()
  where owner_token = trim(requested_owner_token)
  returning *
  into updated_profile;

  if updated_profile.public_id is null then
    raise exception 'Owner link is not valid.';
  end if;

  return jsonb_build_object(
    'success', true,
    'publicId', updated_profile.public_id
  );
end;
$$;

grant execute on function public.ensure_guardian_pet_profile(text)
to authenticated;

grant execute on function public.get_guardian_pet_public(text)
to anon, authenticated;

grant execute on function public.submit_guardian_pet_found_report(
  text,
  text,
  text,
  text,
  text,
  text
)
to anon, authenticated;

grant execute on function public.get_guardian_pet_owner_profile(text)
to anon, authenticated;

grant execute on function public.update_guardian_pet_owner_profile(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
)
to anon, authenticated;
