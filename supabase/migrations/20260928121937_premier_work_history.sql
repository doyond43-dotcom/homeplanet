create or replace function public.get_premier_work_history(
  p_access_token uuid,
  p_search text default null
)
returns table(
  id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  archived_at timestamp with time zone,
  first_name text,
  last_name text,
  phone text,
  email text,
  project_address text,
  intake_notes text,
  source text,
  current_stage text,
  next_action text,
  assigned_salesperson text,
  contact_status text,
  measurement_appointment timestamp with time zone,
  latest_sales_note text
)
language sql
security definer
set search_path = ''
as $$
  select
    j.id,
    j.created_at,
    j.updated_at,
    j.archived_at,
    j.first_name,
    j.last_name,
    j.phone,
    j.email,
    j.project_address,
    j.intake_notes,
    j.source,
    j.current_stage,
    j.next_action,
    j.assigned_salesperson,
    j.contact_status,
    j.measurement_appointment,
    j.latest_sales_note
  from public.premier_jobs j
  where j.is_archived = true
    and exists (
      select 1
      from private.premier_staff_access a
      where a.access_token = p_access_token
        and a.is_active = true
        and (a.expires_at is null or a.expires_at > now())
    )
    and (
      nullif(btrim(coalesce(p_search, '')), '') is null
      or concat_ws(
        ' ',
        j.first_name,
        j.last_name,
        j.phone,
        j.email,
        j.project_address
      ) ilike '%' || btrim(p_search) || '%'
    )
  order by
    j.archived_at desc nulls last,
    j.updated_at desc,
    j.created_at desc
  limit 250;
$$;