create or replace function public.complete_premier_installation(
  p_access_token uuid,
  p_job_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bucking public.premier_installer_proof_photos%rowtype;
begin
  if not exists (
    select 1
    from private.premier_staff_access a
    where a.access_token = p_access_token
      and a.is_active = true
      and (a.expires_at is null or a.expires_at > now())
  ) then
    return false;
  end if;

  select *
  into v_bucking
  from public.premier_installer_proof_photos
  where job_id = p_job_id
    and proof_type = 'Bucking / buck inspection'
  order by uploaded_at desc
  limit 1;

  if v_bucking.id is null then
    raise exception 'Bucking proof photo is required before finishing installation';
  end if;

  if trim(coalesce(v_bucking.bucking_notes, '')) = '' then
    raise exception 'Bucking inspection notes are required before finishing installation';
  end if;

  if trim(coalesce(v_bucking.measurement_notes, '')) = '' then
    raise exception 'Measurement notes are required before finishing installation';
  end if;

  if trim(coalesce(v_bucking.material_issue_notes, '')) = '' then
    raise exception 'Material issue notes are required before finishing installation';
  end if;

  if coalesce(v_bucking.needs_attention, false) = true then
    raise exception 'This installation still needs attention and cannot be finished yet';
  end if;

  update public.premier_jobs j
  set
    current_stage = 'installation_complete',
    status = 'active',
    next_action = 'Office to schedule required inspection and final walkthrough.',
    latest_sales_note = 'Installer completed installation and relayed the job back to Office.',
    updated_at = now()
  where j.id = p_job_id
    and j.current_stage = 'installation_in_progress';

  return found;
end;
$$;