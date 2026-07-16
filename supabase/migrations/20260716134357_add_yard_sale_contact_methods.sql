alter table public.yard_sales
  add column if not exists contact_method text,
  add column if not exists contact_value text,
  add column if not exists facebook_url text;

alter table public.yard_sales
  drop constraint if exists yard_sales_contact_method_check;

alter table public.yard_sales
  add constraint yard_sales_contact_method_check
  check (
    contact_method is null
    or contact_method in ('text', 'facebook')
  );

update public.yard_sales
set
  contact_method = 'text',
  contact_value = '+18635320683',
  facebook_url = 'https://m.me/doyon.56'
where slug = 'danny-s-treasure-island-yard-sale-m8qizd'
  and contact_method is null;