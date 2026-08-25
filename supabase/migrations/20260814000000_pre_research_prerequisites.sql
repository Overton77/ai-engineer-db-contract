-- The surviving pre-research migrations depend on this trigger helper.
-- Its original definition lived in the retired legacy application history,
-- so it is restated here to make the active migration chain replayable.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Maintains updated_at for the preserved public pre-research pipeline.';

-- Preserved factory migrations originally referenced these legacy tables.
-- The teardown migration removes the foreign keys and drops both tables. The
-- stubs make a fresh replay follow the same transition as the live database.
create table if not exists public.challenge (
  challenge_id uuid primary key
);

create table if not exists public.attempt (
  attempt_id uuid primary key
);
