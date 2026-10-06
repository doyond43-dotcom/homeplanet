create or replace function public.complete_premier_job_closeout(
  p_access_token uuid,
  p_job_id uuid
)
returns boolean
language plpgsql
security definer
set search_path to ''
as $function$
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

  if not exists (
    select 1
    from public.premier_job_payments p
    where p.job_id = p_job_id
      and p.payment_stage = 'final_10'
      and p.status = 'received'
  ) then
    raise exception 'Final 10%% payment must be received before completing job closeout.';
  end if;

  update public.premier_jobs j
  set
    current_stage = 'completed',
    status = 'completed',
    next_action = 'Job complete.',
    completed_at = now(),
    latest_sales_note = 'Office completed final payment and administrative closeout.',
    updated_at = now()
  where j.id = p_job_id
    and j.current_stage = 'hundred_percent_complete';

  return found;
end;
$function$;
