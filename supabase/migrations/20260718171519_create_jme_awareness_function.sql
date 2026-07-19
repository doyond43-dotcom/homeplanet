create or replace function public.get_jme_awareness_requests()
returns table (
    id uuid,
    request_type text,
    status text,
    equipment text,
    brand_model text,
    requested_start_date date,
    requested_return_date date,
    movement_preference text,
    problem_description text,
    equipment_condition text,
    service_preference text,
    photo_count integer,
    created_at timestamptz
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
        r.equipment,
        r.brand_model,
        r.requested_start_date,
        r.requested_return_date,
        r.movement_preference,
        r.problem_description,
        r.equipment_condition,
        r.service_preference,
        coalesce(array_length(r.photo_names, 1), 0)::integer as photo_count,
        r.created_at
    from public.jme_requests r
    where r.status not in ('completed', 'declined', 'cancelled')
    order by r.created_at desc
    limit 100;
$$;

revoke all
on function public.get_jme_awareness_requests()
from public;

grant execute
on function public.get_jme_awareness_requests()
to anon, authenticated;

comment on function public.get_jme_awareness_requests() is
    'Safe awareness-only JME request feed. Excludes customer phone, private location, and other protected request details.';