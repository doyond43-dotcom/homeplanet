create or replace function public.get_jme_request_detail(p_request_id uuid)
returns table (
    id uuid,
    request_type text,
    status text,
    customer_name text,
    customer_phone text,
    equipment text,
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
    photo_names text[],
    created_at timestamptz,
    updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
    select
        r.id,
        r.request_type,
        r.status,
        r.customer_name,
        r.customer_phone,
        r.equipment,
        r.brand_model,
        r.requested_start_date,
        r.requested_return_date,
        r.movement_preference,
        r.project_details,
        r.project_location,
        r.problem_description,
        r.equipment_condition,
        r.service_preference,
        r.equipment_location,
        r.photo_names,
        r.created_at,
        r.updated_at
    from public.jme_requests r
    where r.id = p_request_id
    limit 1;
$$;

revoke all
on function public.get_jme_request_detail(uuid)
from public;

grant execute
on function public.get_jme_request_detail(uuid)
to authenticated;

comment on function public.get_jme_request_detail(uuid) is
    'Private JME operator request detail feed for one selected request. Requires an authenticated operator session.';