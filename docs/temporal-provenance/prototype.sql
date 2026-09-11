-- Discussion prototype. Run only in an EMPTY, DISPOSABLE database.
-- No dependency on or mutation of the shared Supabase schema.
-- The fixture publisher is NOT a production ingestion API.
create extension if not exists btree_gist;
create schema temporal_demo;
revoke all on schema temporal_demo from public;

create table temporal_demo.tenant (
  id uuid primary key,
  name text not null
);
create table temporal_demo.repository (
  tenant_id uuid not null references temporal_demo.tenant,
  id uuid not null,
  provider_id text not null,
  primary key (tenant_id, id),
  unique (tenant_id, provider_id)
);

-- Evidence may be imprecise. It does not become canonical state automatically.
create table temporal_demo.temporal_extent (
  tenant_id uuid not null references temporal_demo.tenant,
  id integer not null,
  kind text not null check (kind in
    ('exact_interval','point_observation','uncertain_interval','unknown')),
  valid_during tstzrange,
  observed_world_at timestamptz,
  start_window tstzrange,
  end_window tstzrange,
  precision text not null check (precision in ('instant','day','month','year','unknown')),
  original_text text not null,
  timezone_name text,
  primary key (tenant_id, id),
  check (
    (kind = 'exact_interval' and valid_during is not null
      and observed_world_at is null and start_window is null and end_window is null)
    or (kind = 'point_observation' and valid_during is null
      and observed_world_at is not null and start_window is null and end_window is null)
    or (kind = 'uncertain_interval' and valid_during is null
      and observed_world_at is null and num_nonnulls(start_window,end_window) > 0)
    or (kind = 'unknown' and num_nonnulls(valid_during,observed_world_at,start_window,end_window) = 0)
  ),
  check (valid_during is null or not isempty(valid_during)),
  check (start_window is null or (not isempty(start_window)
    and not lower_inf(start_window) and not upper_inf(start_window))),
  check (end_window is null or (not isempty(end_window)
    and not lower_inf(end_window) and not upper_inf(end_window))),
  -- Reject impossible ordering; partially overlapping boundary windows retain uncertainty.
  check (start_window is null or end_window is null
    or lower(start_window) < upper(end_window))
);

create table temporal_demo.observation (
  tenant_id uuid not null,
  id integer not null,
  repository_id uuid not null,
  extent_id integer not null,
  discovered_at timestamptz not null,
  registered_at timestamptz not null,
  source_published_at timestamptz,
  captured_at timestamptz not null,
  verified_at timestamptz not null,
  capture_ref text not null,
  claim_ref text not null,
  statement text not null,
  primary key (tenant_id, id),
  unique (tenant_id, repository_id, id),
  foreign key (tenant_id, repository_id)
    references temporal_demo.repository,
  foreign key (tenant_id, extent_id)
    references temporal_demo.temporal_extent,
  check (registered_at >= discovered_at),
  check (verified_at >= captured_at)
);

create table temporal_demo.knowledge_head (
  tenant_id uuid primary key references temporal_demo.tenant,
  knowledge_seq bigint not null default 0 check (knowledge_seq >= 0)
);
create table temporal_demo.knowledge_batch (
  tenant_id uuid not null references temporal_demo.tenant,
  knowledge_seq bigint not null check (knowledge_seq > 0),
  recorded_at timestamptz not null,
  change_kind text not null check (change_kind in
    ('initial_admission','world_change','knowledge_correction','dispute','resolution')),
  decision_receipt_ref text not null,
  policy_ref text not null,
  input_manifest_ref text not null,
  primary key (tenant_id, knowledge_seq)
);
create table temporal_demo.repository_archival_revision (
  tenant_id uuid not null,
  repository_id uuid not null,
  knowledge_seq bigint not null,
  previous_seq bigint,
  primary key (tenant_id, repository_id, knowledge_seq),
  foreign key (tenant_id, repository_id) references temporal_demo.repository,
  foreign key (tenant_id, knowledge_seq) references temporal_demo.knowledge_batch
    deferrable initially deferred,
  foreign key (tenant_id, repository_id, previous_seq)
    references temporal_demo.repository_archival_revision,
  check (previous_seq is null or previous_seq < knowledge_seq)
);
create table temporal_demo.repository_archival_segment (
  tenant_id uuid not null,
  repository_id uuid not null,
  knowledge_seq bigint not null,
  segment_no integer not null check (segment_no > 0),
  valid_during tstzrange not null,
  belief text not null check (belief in ('accepted','disputed','unknown')),
  archived boolean,
  temporal_basis text not null check (temporal_basis in
    ('explicit_interval','carry_forward','unresolved')),
  revalidate_after timestamptz,
  primary key (tenant_id, repository_id, knowledge_seq, segment_no),
  foreign key (tenant_id, repository_id, knowledge_seq)
    references temporal_demo.repository_archival_revision,
  check ((belief = 'accepted' and archived is not null and temporal_basis <> 'unresolved')
    or (belief <> 'accepted' and archived is null and temporal_basis = 'unresolved')),
  check (not isempty(valid_during) and not lower_inf(valid_during)
    and isfinite(lower(valid_during)) and lower_inc(valid_during)
    and not upper_inc(valid_during)
    and (upper_inf(valid_during) or isfinite(upper(valid_during)))),
  exclude using gist (
    tenant_id with =, repository_id with =, knowledge_seq with =, valid_during with &&
  )
);
create table temporal_demo.segment_evidence (
  tenant_id uuid not null,
  repository_id uuid not null,
  knowledge_seq bigint not null,
  segment_no integer not null,
  observation_id integer not null,
  evidence_role text not null check (evidence_role in ('supports','challenges','context')),
  primary key (tenant_id, repository_id, knowledge_seq, segment_no, observation_id),
  foreign key (tenant_id, repository_id, knowledge_seq, segment_no)
    references temporal_demo.repository_archival_segment,
  foreign key (tenant_id, repository_id, observation_id)
    references temporal_demo.observation (tenant_id, repository_id, id)
);
create table temporal_demo.segment_lineage (
  tenant_id uuid not null,
  repository_id uuid not null,
  child_seq bigint not null,
  child_segment_no integer not null,
  parent_seq bigint not null,
  parent_segment_no integer not null,
  relation_kind text not null check (relation_kind in
    ('corrects','carries_forward','reassesses','split_from')),
  primary key (tenant_id, repository_id, child_seq, child_segment_no,
    parent_seq, parent_segment_no, relation_kind),
  foreign key (tenant_id, repository_id, child_seq, child_segment_no)
    references temporal_demo.repository_archival_segment,
  foreign key (tenant_id, repository_id, parent_seq, parent_segment_no)
    references temporal_demo.repository_archival_segment,
  check (parent_seq < child_seq)
);

create function temporal_demo.reject_mutation() returns trigger language plpgsql as $$
begin raise exception 'immutable history: %', tg_table_name; end $$;
do $$ declare n text; begin
  foreach n in array array['temporal_extent','observation','knowledge_batch',
    'repository_archival_revision','repository_archival_segment','segment_evidence','segment_lineage'] loop
    execute format('create trigger immutable before update or delete on temporal_demo.%I
      for each row execute function temporal_demo.reject_mutation()', n);
  end loop;
end $$;

-- A batch row is inserted LAST and seals membership, in the same transaction.
create function temporal_demo.require_unsealed_batch() returns trigger language plpgsql as $$
declare k bigint;
begin
  k := case when tg_table_name = 'segment_lineage'
    then (to_jsonb(new)->>'child_seq')::bigint
    else (to_jsonb(new)->>'knowledge_seq')::bigint end;
  if exists (select 1 from temporal_demo.knowledge_batch
    where tenant_id = new.tenant_id and knowledge_seq = k) then
    raise exception 'batch already sealed';
  end if;
  return new;
end $$;
do $$ declare n text; begin
  foreach n in array array['repository_archival_revision','repository_archival_segment',
    'segment_evidence','segment_lineage'] loop
    execute format('create trigger seal_guard before insert on temporal_demo.%I
      for each row execute function temporal_demo.require_unsealed_batch()', n);
  end loop;
end $$;

-- Returns covered spans AND explicit unknown gaps. p_window must be nonempty [).
create function temporal_demo.repository_timeline(
  p_tenant uuid, p_repository uuid, p_window tstzrange, p_knowledge_seq bigint
) returns table (
  valid_during tstzrange, belief text, archived boolean, temporal_basis text,
  revalidate_after timestamptz, knowledge_seq bigint, segment_no integer
) language sql stable as $$
  with chosen as (
    select max(r.knowledge_seq) as k from temporal_demo.repository_archival_revision r
    where r.tenant_id=p_tenant and r.repository_id=p_repository
      and r.knowledge_seq <= p_knowledge_seq
  ), segments as (
    select s.valid_during * p_window as clipped, s.*
    from temporal_demo.repository_archival_segment s, chosen c
    where s.tenant_id=p_tenant and s.repository_id=p_repository
      and s.knowledge_seq=c.k and s.valid_during && p_window
  ), uncovered as (
    select unnest(tstzmultirange(p_window) -
      coalesce(range_agg(clipped), '{}'::tstzmultirange)) as gap from segments
  )
  select clipped, s.belief, s.archived, s.temporal_basis, s.revalidate_after,
    s.knowledge_seq, s.segment_no from segments s
  union all
  select gap, 'unknown', null::boolean, 'unresolved', null::timestamptz,
    c.k, null::integer from uncovered cross join chosen c
  order by 1
$$;

create function temporal_demo.repository_state(
  p_tenant uuid, p_repository uuid, p_world_at timestamptz,
  p_knowledge_seq bigint, p_evaluation_at timestamptz
) returns table (belief text, archived boolean, freshness text, knowledge_seq bigint)
language sql stable as $$
  with chosen as (
    select max(r.knowledge_seq) as k from temporal_demo.repository_archival_revision r
    where r.tenant_id=p_tenant and r.repository_id=p_repository
      and r.knowledge_seq<=p_knowledge_seq
  )
  select coalesce(s.belief,'unknown'), s.archived,
    case when s.belief is distinct from 'accepted' or s.revalidate_after is null
      then 'not_assessed'
      when p_evaluation_at >= s.revalidate_after then 'stale' else 'fresh' end,
    c.k
  from chosen c left join temporal_demo.repository_archival_segment s
    on s.tenant_id=p_tenant and s.repository_id=p_repository
    and s.knowledge_seq=c.k and s.valid_during @> p_world_at
$$;

-- Fixtures below: all claims, timestamps and references are fictional.
insert into temporal_demo.tenant values
 ('00000000-0000-0000-0000-000000000001','Example tenant'),
 ('00000000-0000-0000-0000-000000000002','Other tenant');
insert into temporal_demo.repository values
 ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000101','example:repo:101');
insert into temporal_demo.knowledge_head(tenant_id) select id from temporal_demo.tenant;
insert into temporal_demo.temporal_extent
 (tenant_id,id,kind,valid_during,precision,original_text,timezone_name)
values
 ('00000000-0000-0000-0000-000000000001',1,'exact_interval','[2026-05-01 00:00Z,)','instant','Unarchived since May 1 00:00 UTC','UTC'),
 ('00000000-0000-0000-0000-000000000001',2,'exact_interval','[2026-06-05 00:00Z,)','instant','Archived June 5 00:00 UTC','UTC'),
 ('00000000-0000-0000-0000-000000000001',3,'exact_interval','[2026-06-03 00:00Z,)','instant','Correction: June 3 00:00 UTC','UTC'),
 ('00000000-0000-0000-0000-000000000001',4,'exact_interval','[2026-06-05 00:00Z,)','instant','Conflicting notice says June 5 00:00 UTC','UTC'),
 ('00000000-0000-0000-0000-000000000001',5,'exact_interval','[2026-06-03 00:00Z,)','instant','Reviewed event log confirms June 3 00:00 UTC','UTC');
insert into temporal_demo.observation
 (tenant_id,id,repository_id,extent_id,discovered_at,registered_at,
  source_published_at,captured_at,verified_at,capture_ref,claim_ref,statement)
select '00000000-0000-0000-0000-000000000001', n,
 '00000000-0000-0000-0000-000000000101', n,
 d::timestamptz, d::timestamptz + interval '1 minute',
 d::timestamptz - interval '1 hour', d::timestamptz + interval '2 minutes',
 d::timestamptz + interval '3 minutes', 'fixture:capture:'||n,'fixture:claim:'||n,
 'Fictional supporting observation '||n
from (values (1,'2026-06-01 10:00Z'),(2,'2026-06-09 10:00Z'),
 (3,'2026-06-19 10:00Z'),(4,'2026-06-21 10:00Z'),(5,'2026-06-24 10:00Z')) v(n,d);

-- TEST-ONLY publisher: permits historical clocks so scenarios are deterministic.
-- Production: no caller time; replace text handles with typed FKs, add receipt
-- idempotency, policy/claim validation, RLS and outbox. Do not grant this function.
create function temporal_demo.fixture_publish(
  p_expected_head bigint, p_recorded_at timestamptz, p_kind text, p_segments jsonb
) returns bigint language plpgsql as $$
declare
  t constant uuid := '00000000-0000-0000-0000-000000000001';
  r constant uuid := '00000000-0000-0000-0000-000000000101';
  h bigint; k bigint; prev bigint; s jsonb; e jsonb; parent jsonb; n integer := 0;
begin
  select knowledge_seq into h from temporal_demo.knowledge_head where tenant_id=t for update;
  if h <> p_expected_head then raise exception 'rebase_required'; end if;
  if exists (select 1 from temporal_demo.knowledge_batch
    where tenant_id=t and recorded_at>=p_recorded_at) then
    raise exception 'knowledge clock must advance';
  end if;
  k := h+1;
  select max(knowledge_seq) into prev from temporal_demo.repository_archival_revision
    where tenant_id=t and repository_id=r;
  insert into temporal_demo.repository_archival_revision values (t,r,k,prev);
  for s in select value from jsonb_array_elements(p_segments) loop
    n := n+1;
    insert into temporal_demo.repository_archival_segment values
      (t,r,k,n,(s->>'during')::tstzrange,s->>'belief',(s->>'archived')::boolean,
       coalesce(s->>'basis','explicit_interval'),(s->>'revalidate_after')::timestamptz);
    if jsonb_array_length(coalesce(s->'evidence','[]'::jsonb))=0 then
      raise exception 'evidence required';
    end if;
    for e in select value from jsonb_array_elements(s->'evidence') loop
      if exists(select 1 from temporal_demo.observation
        where tenant_id=t and id=(e->>'id')::integer and verified_at>p_recorded_at) then
        raise exception 'future evidence';
      end if;
      insert into temporal_demo.segment_evidence values
        (t,r,k,n,(e->>'id')::integer,coalesce(e->>'role','supports'));
    end loop;
    for parent in select value from jsonb_array_elements(coalesce(s->'parents','[]'::jsonb)) loop
      insert into temporal_demo.segment_lineage values
        (t,r,k,n,prev,(parent->>'segment')::integer,parent->>'kind');
    end loop;
  end loop;
  insert into temporal_demo.knowledge_batch values
    (t,k,p_recorded_at,p_kind,'fixture:receipt:'||k,'fixture:policy:v1','fixture:inputs:'||k);
  update temporal_demo.knowledge_head set knowledge_seq=k where tenant_id=t;
  return k;
end $$;
revoke all on all functions in schema temporal_demo from public;

select temporal_demo.fixture_publish(0,'2026-06-02 00:00Z','initial_admission',
'[{"during":"[2026-05-01 00:00Z,)","belief":"accepted","archived":false,"revalidate_after":"2026-06-08 00:00Z","evidence":[{"id":1}]}]');
select temporal_demo.fixture_publish(1,'2026-06-10 00:00Z','world_change',
'[{"during":"[2026-05-01 00:00Z,2026-06-05 00:00Z)","belief":"accepted","archived":false,"evidence":[{"id":1},{"id":2}],"parents":[{"segment":1,"kind":"split_from"}]},
  {"during":"[2026-06-05 00:00Z,)","belief":"accepted","archived":true,"revalidate_after":"2026-06-17 00:00Z","evidence":[{"id":2}],"parents":[{"segment":1,"kind":"split_from"}]}]');
select temporal_demo.fixture_publish(2,'2026-06-20 00:00Z','knowledge_correction',
'[{"during":"[2026-05-01 00:00Z,2026-06-03 00:00Z)","belief":"accepted","archived":false,"evidence":[{"id":1},{"id":3}],"parents":[{"segment":1,"kind":"corrects"}]},
  {"during":"[2026-06-03 00:00Z,)","belief":"accepted","archived":true,"revalidate_after":"2026-06-27 00:00Z","evidence":[{"id":3}],"parents":[{"segment":2,"kind":"corrects"}]}]');
select temporal_demo.fixture_publish(3,'2026-06-22 00:00Z','dispute',
'[{"during":"[2026-05-01 00:00Z,2026-06-03 00:00Z)","belief":"accepted","archived":false,"evidence":[{"id":1},{"id":3}],"parents":[{"segment":1,"kind":"carries_forward"}]},
  {"during":"[2026-06-03 00:00Z,2026-06-05 00:00Z)","belief":"disputed","basis":"unresolved","evidence":[{"id":3},{"id":4,"role":"challenges"}],"parents":[{"segment":2,"kind":"reassesses"}]},
  {"during":"[2026-06-05 00:00Z,)","belief":"accepted","archived":true,"revalidate_after":"2026-06-29 00:00Z","evidence":[{"id":3},{"id":4}],"parents":[{"segment":2,"kind":"split_from"}]}]');
select temporal_demo.fixture_publish(4,'2026-06-25 00:00Z','resolution',
'[{"during":"[2026-05-01 00:00Z,2026-06-03 00:00Z)","belief":"accepted","archived":false,"evidence":[{"id":1},{"id":5}],"parents":[{"segment":1,"kind":"carries_forward"}]},
  {"during":"[2026-06-03 00:00Z,)","belief":"accepted","archived":true,"revalidate_after":"2026-07-02 00:00Z","evidence":[{"id":5}],"parents":[{"segment":2,"kind":"reassesses"},{"segment":3,"kind":"carries_forward"}]}]');
