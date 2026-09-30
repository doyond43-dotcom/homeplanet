alter table public.starter_system_subscriptions
  add column if not exists activation_email_sent_at timestamptz null,
  add column if not exists activation_email_message_id text null;
