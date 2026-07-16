create extension if not exists pgcrypto;

create table if not exists public.yard_sales (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sale_name text not null,
  area text not null,
  sale_date date not null,
  start_time time not null,
  description text not null default '',
  contact text not null,
  featured_items jsonb not null default '[]'::jsonb,
  main_photo_url text,
  main_photo_path text,
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists yard_sales_status_date_idx
  on public.yard_sales (status, sale_date);

alter table public.yard_sales enable row level security;

drop policy if exists "Public can view published yard sales"
  on public.yard_sales;

create policy "Public can view published yard sales"
  on public.yard_sales
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Anyone can create a published yard sale"
  on public.yard_sales;

create policy "Anyone can create a published yard sale"
  on public.yard_sales
  for insert
  to anon, authenticated
  with check (
    status = 'published'
    and length(trim(slug)) between 3 and 100
    and length(trim(sale_name)) between 3 and 140
    and length(trim(area)) between 2 and 180
    and length(trim(contact)) between 2 and 240
    and jsonb_typeof(featured_items) = 'array'
  );

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'yard-sale-images',
  'yard-sale-images',
  true,
  8388608,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view yard sale images"
  on storage.objects;

create policy "Public can view yard sale images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'yard-sale-images');

drop policy if exists "Anyone can upload yard sale images"
  on storage.objects;

create policy "Anyone can upload yard sale images"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'yard-sale-images'
    and lower(storage.extension(name)) in (
      'jpg',
      'jpeg',
      'png',
      'webp',
      'heic',
      'heif'
    )
  );