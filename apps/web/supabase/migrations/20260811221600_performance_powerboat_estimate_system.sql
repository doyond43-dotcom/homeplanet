begin;

alter table public.performance_powerboat_projects
  add column if not exists estimate_number text,
  add column if not exists estimate_total numeric(12,2),
  add column if not exists estimate_notes text,
  add column if not exists estimate_status text,
  add column if not exists estimate_sent_at timestamptz,
  add column if not exists estimate_approved_at timestamptz;

alter table public.performance_powerboat_projects
  drop constraint if exists performance_powerboat_estimate_total_check;

alter table public.performance_powerboat_projects
  add constraint performance_powerboat_estimate_total_check
  check (estimate_total is null or estimate_total >= 0);

alter table public.performance_powerboat_projects
  drop constraint if exists performance_powerboat_estimate_status_check;

alter table public.performance_powerboat_projects
  add constraint performance_powerboat_estimate_status_check
  check (
    estimate_status is null
    or estimate_status in ('draft', 'sent', 'approved')
  );

create or replace function public.get_performance_powerboat_customer_estimate(
  p_project_id uuid,
  p_token uuid
)
returns table (
  id uuid,
  project_type text,
  customer_name text,
  boat_year text,
  boat_make_model text,
  boat_length text,
  boat_engines text,
  customer_request text,
  recommended_work text,
  labor jsonb,
  parts jsonb,
  estimate_number text,
  estimate_total numeric,
  estimate_notes text,
  estimate_status text,
  estimate_sent_at timestamptz,
  estimate_approved_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    p.id,
    p.project_type,
    p.customer_name,
    p.boat_year,
    p.boat_make_model,
    p.boat_length,
    p.boat_engines,
    p.customer_request,
    p.recommended_work,
    p.labor,
    p.parts,
    p.estimate_number,
    p.estimate_total,
    p.estimate_notes,
    p.estimate_status,
    p.estimate_sent_at,
    p.estimate_approved_at
  from public.performance_powerboat_projects p
  where p.id = p_project_id
    and p.customer_access_token = p_token
    and p.estimate_status in ('sent', 'approved')
  limit 1;
$$;

grant execute on function
  public.get_performance_powerboat_customer_estimate(uuid, uuid)
to anon, authenticated;

create or replace function public.approve_performance_powerboat_customer_estimate(
  p_project_id uuid,
  p_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  select estimate_status
  into v_status
  from public.performance_powerboat_projects
  where id = p_project_id
    and customer_access_token = p_token
  limit 1;

  if v_status is null then
    return false;
  end if;

  if v_status = 'approved' then
    return true;
  end if;

  if v_status <> 'sent' then
    return false;
  end if;

  update public.performance_powerboat_projects
  set
    estimate_status = 'approved',
    estimate_approved_at = now(),
    current_milestone = 'Approved',
    next_action = 'Prepare the job for work',
    waiting_on = null,
    timeline = coalesce(timeline, '[]'::jsonb) ||
      jsonb_build_array(
        jsonb_build_object(
          'at', now(),
          'label', 'Customer approved estimate'
        )
      ),
    updated_at = now()
  where id = p_project_id
    and customer_access_token = p_token;

  return found;
end;
$$;

grant execute on function
  public.approve_performance_powerboat_customer_estimate(uuid, uuid)
to anon, authenticated;

commit;
