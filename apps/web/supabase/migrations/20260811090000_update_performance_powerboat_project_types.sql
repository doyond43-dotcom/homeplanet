create or replace function public.submit_performance_powerboat_project(
  p_project_type text, p_customer_name text, p_customer_phone text,
  p_customer_email text default null, p_boat_year text default null,
  p_boat_make_model text default null, p_boat_length text default null,
  p_boat_engines text default null, p_boat_location text default null,
  p_customer_request text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if p_project_type not in (
    'Build a Performance',
    'Service & Repair',
    'Custom Metal Fabrication'
  ) then
    raise exception 'Invalid project type';
  end if;

  if nullif(btrim(p_customer_name), '') is null or nullif(btrim(p_customer_phone), '') is null then
    raise exception 'Name and phone are required';
  end if;

  insert into public.performance_powerboat_projects (
    project_type, customer_name, customer_phone, customer_email, boat_year,
    boat_make_model, boat_length, boat_engines, boat_location, customer_request, timeline
  ) values (
    p_project_type, btrim(p_customer_name), btrim(p_customer_phone), nullif(btrim(p_customer_email), ''),
    nullif(btrim(p_boat_year), ''), nullif(btrim(p_boat_make_model), ''),
    nullif(btrim(p_boat_length), ''), nullif(btrim(p_boat_engines), ''),
    nullif(btrim(p_boat_location), ''), nullif(btrim(p_customer_request), ''),
    jsonb_build_array(jsonb_build_object('at', now(), 'label', 'Customer submitted project request'))
  ) returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_performance_powerboat_project(text,text,text,text,text,text,text,text,text,text) from public;
grant execute on function public.submit_performance_powerboat_project(text,text,text,text,text,text,text,text,text,text) to anon, authenticated;
