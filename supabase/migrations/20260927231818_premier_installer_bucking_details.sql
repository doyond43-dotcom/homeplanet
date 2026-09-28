alter table public.premier_installer_proof_photos
  add column if not exists bucking_notes text not null default '',
  add column if not exists measurement_notes text not null default '',
  add column if not exists material_issue_notes text not null default '',
  add column if not exists needs_attention boolean not null default false;

create or replace function public.save_premier_installer_bucking_details(
  p_access_token uuid,
  p_job_id uuid,
  p_bucking_notes text,
  p_measurement_notes text,
  p_material_issue_notes text,
  p_needs_attention boolean
)
returns boolean
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_proof_id uuid;
begin
  if not exists (
    select 1
    from public.get_premier_installer_jobs(p_access_token) j
    where j.id = p_job_id
  ) then
    raise exception 'Installer access denied for this job';
  end if;

  select id
  into v_proof_id
  from public.premier_installer_proof_photos
  where job_id = p_job_id
    and proof_type = 'Bucking / buck inspection'
  order by uploaded_at desc
  limit 1;

  if v_proof_id is null then
    raise exception 'Upload Bucking proof photo first';
  end if;

  update public.premier_installer_proof_photos
  set
    bucking_notes = coalesce(p_bucking_notes, ''),
    measurement_notes = coalesce(p_measurement_notes, ''),
    material_issue_notes = coalesce(p_material_issue_notes, ''),
    needs_attention = coalesce(p_needs_attention, false)
  where id = v_proof_id;

  return true;
end;
$$;
