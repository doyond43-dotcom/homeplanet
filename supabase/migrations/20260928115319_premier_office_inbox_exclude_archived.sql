create or replace function public.get_premier_office_inbox(
  p_access_token uuid
)
returns table(
  id uuid,
  created_at timestamp with time zone,
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
  where j.is_archived = false
    and j.current_stage in (
      'new_lead',
      'proposal',
      'proposal_revision',
      'proposal_approved',
      'production_setup',
      'installation_complete',
      'inspection_complete'
    )
    and exists (
      select 1
      from private.premier_staff_access a
      where a.access_token = p_access_token
        and a.is_active = true
        and (a.expires_at is null or a.expires_at > now())
    )
  order by
    case
      when j.current_stage = 'inspection_complete' then 0
      when j.current_stage = 'installation_complete' then 1
      when j.current_stage = 'proposal_revision' then 2
      when j.current_stage = 'proposal_approved' then 3
      when j.current_stage = 'production_setup' then 4
      when j.current_stage = 'proposal' then 5
      else 6
    end,
    j.updated_at desc,
    j.created_at desc
  limit 100;
$$;