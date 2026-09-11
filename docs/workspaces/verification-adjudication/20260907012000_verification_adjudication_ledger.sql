-- DRAFT ONLY: do not place under supabase/migrations or apply before review.
-- Verification adjudication ledger. Additive, tenant-scoped, packet-bound and append-only.
-- No reviewer grant or decision is seeded by this migration.
begin;
set local lock_timeout = '10s';
set local statement_timeout = '120s';

-- These roles are intentionally NOLOGIN. A future server-only factory may assume
-- it after authenticating a human actor and resolving an active grant; no
-- browser, worker, or generic control-plane path receives this authority.
do $$ declare r text;
begin
 foreach r in array array['verification_adjudicator_grant_admin','verification_adjudicator'] loop
   if not exists (select 1 from pg_roles where rolname=r) then execute format('create role %I nologin noinherit',r); end if;
 end loop;
exception when insufficient_privilege then
 raise exception 'verification_adjudicator role provisioning requires migration-owner privilege';
end $$;
grant usage on schema knowledge_service,evidence,orchestration,util to verification_adjudicator_grant_admin,verification_adjudicator;

insert into orchestration.artifact_type(code, description) values
 ('verification_policy_override', 'Append-only policy exception authorized by a packet-bound human adjudication decision')
on conflict(code) do nothing;

create table knowledge_service.verification_adjudicator_grant (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  actor_id uuid not null,
  actor_kind text not null check (actor_kind = 'human'),
  reviewer_role text not null check (btrim(reviewer_role) <> ''),
  authorization_version text not null check (btrim(authorization_version) <> ''),
  authorization_operation_id uuid not null,
  authorized_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, actor_id, reviewer_role, authorization_version),
  foreign key (tenant_id, authorization_operation_id)
    references knowledge_service.operation(tenant_id, id) on delete restrict,
  check (expires_at is null or expires_at > authorized_at)
);

create table knowledge_service.verification_adjudicator_grant_revocation (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  grant_id uuid not null,
  revocation_operation_id uuid not null,
  reason text not null check (btrim(reason) <> ''),
  revoked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, grant_id),
  foreign key (tenant_id, grant_id)
    references knowledge_service.verification_adjudicator_grant(tenant_id, id) on delete restrict,
  foreign key (tenant_id, revocation_operation_id)
    references knowledge_service.operation(tenant_id, id) on delete restrict
);

create table evidence.verification_adjudication_subject (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  request_operation_id uuid not null,
  request_step_id uuid not null,
  request_lease_token uuid not null,
  request_fencing_token bigint not null check (request_fencing_token > 0),
  target_kind text not null check (target_kind in ('assertion', 'evidence', 'run')),
  target_id text not null check (btrim(target_id) <> '' and char_length(target_id) <= 255),
  reason text not null check (reason in ('ambiguous_evidence', 'conflicting_evidence', 'policy_review', 'quality_failure', 'appeal')),
  requester_actor_id uuid not null,
  requester_actor_kind text not null check (requester_actor_kind in ('human', 'service', 'model')),
  requester_note text check (requester_note is null or char_length(requester_note) <= 1000),
  eligible_reviewer_roles text[] not null check (cardinality(eligible_reviewer_roles) > 0),
  quorum_required integer not null default 1 check (quorum_required > 0),
  verification_run_id uuid not null,
  run_manifest_artifact_id uuid not null,
  run_manifest_sha256 text not null check (run_manifest_sha256 ~ '^[0-9a-f]{64}$'),
  bundle_artifact_id uuid not null,
  deterministic_result_artifact_id uuid not null,
  policy_artifact_id uuid not null,
  policy_artifact_sha256 text not null check (policy_artifact_sha256 ~ '^[0-9a-f]{64}$'),
  report_gate_artifact_id uuid,
  report_gate_sha256 text check (report_gate_sha256 is null or report_gate_sha256 ~ '^[0-9a-f]{64}$'),
  packet_artifact_id uuid not null,
  packet_sha256 text not null check (packet_sha256 ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, request_operation_id),
  foreign key (tenant_id, request_operation_id)
    references knowledge_service.operation(tenant_id, id) on delete restrict,
  foreign key (tenant_id, request_step_id)
    references knowledge_service.operation_step(tenant_id, id) on delete restrict,
  foreign key (tenant_id, verification_run_id)
    references evidence.verification_run(tenant_id, id) on delete restrict,
  foreign key (tenant_id, run_manifest_artifact_id)
    references orchestration.artifact(tenant_id, id) on delete restrict,
  foreign key (tenant_id, bundle_artifact_id)
    references orchestration.artifact(tenant_id, id) on delete restrict,
  foreign key (tenant_id, deterministic_result_artifact_id)
    references orchestration.artifact(tenant_id, id) on delete restrict,
  foreign key (tenant_id, policy_artifact_id)
    references orchestration.artifact(tenant_id, id) on delete restrict,
  foreign key (tenant_id, report_gate_artifact_id)
    references orchestration.artifact(tenant_id, id) on delete restrict,
  foreign key (tenant_id, packet_artifact_id)
    references orchestration.artifact(tenant_id, id) on delete restrict,
  check ((report_gate_artifact_id is null) = (report_gate_sha256 is null))
);

create table evidence.verification_adjudication_decision (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  subject_id uuid not null,
  decision_operation_id uuid not null,
  decision_step_id uuid not null,
  decision_lease_token uuid not null,
  decision_fencing_token bigint not null check (decision_fencing_token > 0),
  adjudicator_grant_id uuid not null,
  reviewer_actor_id uuid not null,
  reviewer_actor_kind text not null check (reviewer_actor_kind = 'human'),
  reviewer_role text not null check (btrim(reviewer_role) <> ''),
  packet_sha256 text not null check (packet_sha256 ~ '^[0-9a-f]{64}$'),
  decision text not null check (decision in ('uphold', 'overturn', 'defer', 'request_changes')),
  rationale text not null check (btrim(rationale) <> '' and char_length(rationale) <= 4000),
  decision_artifact_id uuid not null,
  decision_artifact_sha256 text not null check (decision_artifact_sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, decision_operation_id),
  foreign key (tenant_id, subject_id)
    references evidence.verification_adjudication_subject(tenant_id, id) on delete restrict,
  foreign key (tenant_id, adjudicator_grant_id)
    references knowledge_service.verification_adjudicator_grant(tenant_id, id) on delete restrict,
  foreign key (tenant_id, decision_operation_id)
    references knowledge_service.operation(tenant_id, id) on delete restrict,
  foreign key (tenant_id, decision_step_id)
    references knowledge_service.operation_step(tenant_id, id) on delete restrict,
  foreign key (tenant_id, decision_artifact_id)
    references orchestration.artifact(tenant_id, id) on delete restrict
);

create table evidence.verification_policy_override (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  subject_id uuid not null,
  decision_id uuid not null,
  verification_run_id uuid not null,
  policy_artifact_id uuid not null,
  policy_artifact_sha256 text not null check (policy_artifact_sha256 ~ '^[0-9a-f]{64}$'),
  packet_sha256 text not null check (packet_sha256 ~ '^[0-9a-f]{64}$'),
  override_scope_kind text not null check (override_scope_kind in ('assertion', 'evidence', 'run')),
  override_scope_id text not null check (btrim(override_scope_id) <> '' and char_length(override_scope_id) <= 255),
  -- Admission-changing effects remain unavailable until the shared policy replay
  -- owner consumes this ledger under a separately reviewed contract.
  override_disposition text not null check (override_disposition = 'review_required'),
  rationale text not null check (btrim(rationale) <> '' and char_length(rationale) <= 4000),
  override_artifact_id uuid not null,
  override_artifact_sha256 text not null check (override_artifact_sha256 ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, decision_id),
  foreign key (tenant_id, subject_id)
    references evidence.verification_adjudication_subject(tenant_id, id) on delete restrict,
  foreign key (tenant_id, decision_id)
    references evidence.verification_adjudication_decision(tenant_id, id) on delete restrict,
  foreign key (tenant_id, verification_run_id)
    references evidence.verification_run(tenant_id, id) on delete restrict,
  foreign key (tenant_id, policy_artifact_id)
    references orchestration.artifact(tenant_id, id) on delete restrict,
  foreign key (tenant_id, override_artifact_id)
    references orchestration.artifact(tenant_id, id) on delete restrict,
  check (expires_at is null or expires_at > created_at)
);

create index verification_adjudication_subject_queue_idx
  on evidence.verification_adjudication_subject (tenant_id, created_at)
  where expires_at is null or expires_at > created_at;
create index verification_adjudication_decision_subject_idx
  on evidence.verification_adjudication_decision (tenant_id, subject_id, created_at);
create index verification_policy_override_run_idx
  on evidence.verification_policy_override (tenant_id, verification_run_id, created_at);

create or replace function knowledge_service.validate_verification_adjudicator_grant() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 new.authorized_at := clock_timestamp(); new.created_at := new.authorized_at;
 if new.expires_at is not null and new.expires_at <= new.authorized_at then raise exception 'adjudicator grant expiry must be future' using errcode='check_violation'; end if;
 if not exists(select 1 from knowledge_service.operation o where o.tenant_id=new.tenant_id and o.id=new.authorization_operation_id and o.operation_kind='verification_adjudicator_grant') then
   raise exception 'adjudicator grant requires a dedicated grant-administration operation' using errcode='foreign_key_violation';
 end if;
 return new;
end $$;
create or replace function knowledge_service.validate_verification_adjudicator_grant_revocation() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 new.revoked_at := clock_timestamp(); new.created_at := new.revoked_at;
 if not exists(select 1 from knowledge_service.operation o where o.tenant_id=new.tenant_id and o.id=new.revocation_operation_id and o.operation_kind='verification_adjudicator_grant_revocation') then
   raise exception 'adjudicator grant revocation requires a dedicated grant-administration operation' using errcode='foreign_key_violation';
 end if;
 return new;
end $$;

create or replace function evidence.validate_verification_adjudication_subject() returns trigger
language plpgsql set search_path='' as $$
declare expected_parents uuid[];
begin
 new.created_at := clock_timestamp();
 if new.expires_at is not null and new.expires_at <= new.created_at then raise exception 'adjudication subject expiry must be future' using errcode='check_violation'; end if;
 if cardinality(new.eligible_reviewer_roles)<>(select count(distinct role) from unnest(new.eligible_reviewer_roles) role) then raise exception 'adjudication subject reviewer roles must be distinct' using errcode='check_violation'; end if;
  if not exists(
    select 1 from knowledge_service.operation o join knowledge_service.operation_step s
      on s.tenant_id=o.tenant_id and s.operation_id=o.id
    where o.tenant_id=new.tenant_id and o.id=new.request_operation_id
      and o.operation_kind='verification_adjudication' and o.status='running'
      and o.actor_identity=new.requester_actor_kind||':'||new.requester_actor_id::text
      and o.request #>> '{input,useCase}'='requestAdjudication'
      and o.request #>> '{input,request,target,kind}'=new.target_kind
      and o.request #>> array['input','request','target',case when new.target_kind='assertion' then 'assertionId' when new.target_kind='evidence' then 'evidenceId' else 'runId' end]=new.target_id
      and o.request #>> '{input,request,reason}'=new.reason
      and o.request #>> '{input,request,evidencePacket,artifactId}'=new.run_manifest_artifact_id::text
      and o.request #>> '{input,request,evidencePacket,digest}'='sha256:'||new.run_manifest_sha256
      and s.id=new.request_step_id and s.step_key='request_adjudication_and_register' and s.step_kind='request_adjudication_and_register' and s.status='running'
      and exists(select 1 from knowledge_service.lease l where l.tenant_id=s.tenant_id and l.operation_step_id=s.id and l.lease_token=new.request_lease_token and l.fencing_token=new.request_fencing_token and l.released_at is null and l.expires_at>clock_timestamp())
  ) then raise exception 'adjudication subject requires its verification_adjudication operation and step'
    using errcode='foreign_key_violation'; end if;
  if new.target_kind='run' and new.target_id<>new.verification_run_id::text then
    raise exception 'run adjudication target must match the sealed verification run' using errcode='foreign_key_violation';
  end if;

  if not exists(
    select 1 from evidence.verification_run r
    where r.tenant_id=new.tenant_id and r.id=new.verification_run_id
      and r.contract_version='verification.v1' and r.status<>'running' and r.ended_at is not null
      and r.run_manifest_artifact_id=new.run_manifest_artifact_id and r.manifest_sha256=new.run_manifest_sha256
      and r.bundle_artifact_id=new.bundle_artifact_id and r.deterministic_result_artifact_id=new.deterministic_result_artifact_id
      and r.policy_artifact_id=new.policy_artifact_id and r.policy_artifact_sha256=new.policy_artifact_sha256
  ) then raise exception 'adjudication subject run binding mismatch'
    using errcode='foreign_key_violation'; end if;

  if not orchestration.verification_artifact_is_admitted(new.tenant_id,new.run_manifest_artifact_id,'verification_run_manifest',new.run_manifest_sha256)
     or not orchestration.verification_artifact_is_admitted(new.tenant_id,new.bundle_artifact_id,'verification_bundle',null)
     or not orchestration.verification_artifact_is_admitted(new.tenant_id,new.deterministic_result_artifact_id,'deterministic_verification_result',null)
     or not orchestration.verification_artifact_is_admitted(new.tenant_id,new.policy_artifact_id,'verification_policy',new.policy_artifact_sha256)
     or not orchestration.verification_artifact_is_admitted(new.tenant_id,new.packet_artifact_id,'verification_adjudication_packet',new.packet_sha256)
     or (new.report_gate_artifact_id is not null and not orchestration.verification_artifact_is_admitted(new.tenant_id,new.report_gate_artifact_id,'verification_report_result',new.report_gate_sha256))
  then raise exception 'adjudication subject artifact is not admitted with its exact type and digest'
    using errcode='foreign_key_violation'; end if;

  expected_parents := array[new.run_manifest_artifact_id,new.bundle_artifact_id,new.deterministic_result_artifact_id,new.policy_artifact_id]
    || case when new.report_gate_artifact_id is null then '{}'::uuid[] else array[new.report_gate_artifact_id] end;
  if cardinality(expected_parents)<>(select count(distinct parent_id) from unnest(expected_parents) parent_id) then
    raise exception 'adjudication packet expected parent closure is not normalized' using errcode='check_violation';
  end if;
  if not exists(
    select 1 from orchestration.verification_artifact_metadata m
    where m.tenant_id=new.tenant_id and m.artifact_id=new.packet_artifact_id
      and cardinality(m.parent_artifact_ids)=cardinality(expected_parents)
      and cardinality(m.parent_artifact_ids)=(select count(distinct parent_id) from unnest(m.parent_artifact_ids) parent_id)
      and m.parent_artifact_ids @> expected_parents and expected_parents @> m.parent_artifact_ids
  ) then raise exception 'adjudication packet parent closure differs from its exact sealed-run inputs'
    using errcode='foreign_key_violation'; end if;
  return new;
end $$;

create or replace function evidence.validate_verification_adjudication_decision() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 new.created_at := clock_timestamp();
  if not exists(
    select 1 from evidence.verification_adjudication_subject s
    join knowledge_service.verification_adjudicator_grant g on g.tenant_id=s.tenant_id and g.id=new.adjudicator_grant_id
    join knowledge_service.operation o on o.tenant_id=s.tenant_id and o.id=new.decision_operation_id
    join knowledge_service.operation_step ds on ds.tenant_id=o.tenant_id and ds.operation_id=o.id and ds.id=new.decision_step_id
    where s.tenant_id=new.tenant_id and s.id=new.subject_id
      and s.packet_sha256=new.packet_sha256
      and (s.expires_at is null or s.expires_at>new.created_at)
      and new.reviewer_role=any(s.eligible_reviewer_roles)
      and g.actor_kind='human' and g.actor_id=new.reviewer_actor_id and g.reviewer_role=new.reviewer_role
      and g.authorized_at<=new.created_at and (g.expires_at is null or g.expires_at>new.created_at)
      and not exists(select 1 from knowledge_service.verification_adjudicator_grant_revocation x
        where x.tenant_id=g.tenant_id and x.grant_id=g.id and x.revoked_at<=new.created_at)
      and o.operation_kind='verification_adjudication_decision' and o.status='running'
      and o.actor_identity='human:'||new.reviewer_actor_id::text
      and ds.step_key='record_adjudication_decision' and ds.step_kind='record_adjudication_decision' and ds.status='running'
      and exists(select 1 from knowledge_service.lease dl where dl.tenant_id=ds.tenant_id and dl.operation_step_id=ds.id and dl.lease_token=new.decision_lease_token and dl.fencing_token=new.decision_fencing_token and dl.released_at is null and dl.expires_at>clock_timestamp())
  ) then raise exception 'adjudication decision lacks an active server-admitted human grant or exact packet binding'
    using errcode='insufficient_privilege'; end if;
  if not orchestration.verification_artifact_is_admitted(new.tenant_id,new.decision_artifact_id,'verification_adjudication_decision',new.decision_artifact_sha256)
     or not exists(select 1 from orchestration.verification_artifact_metadata m
       where m.tenant_id=new.tenant_id and m.artifact_id=new.decision_artifact_id
         and cardinality(m.parent_artifact_ids)=1
         and cardinality(m.parent_artifact_ids)=(select count(distinct parent_id) from unnest(m.parent_artifact_ids) parent_id)
         and m.parent_artifact_ids @> array[(select packet_artifact_id from evidence.verification_adjudication_subject where tenant_id=new.tenant_id and id=new.subject_id)]
         and array[(select packet_artifact_id from evidence.verification_adjudication_subject where tenant_id=new.tenant_id and id=new.subject_id)] @> m.parent_artifact_ids)
  then raise exception 'adjudication decision artifact parent closure differs from its exact packet'
    using errcode='foreign_key_violation'; end if;
  return new;
end $$;

create or replace function evidence.validate_verification_policy_override() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 new.created_at := clock_timestamp();
 if new.expires_at is not null and new.expires_at <= new.created_at then raise exception 'policy override expiry must be future' using errcode='check_violation'; end if;
  if not exists(
    select 1 from evidence.verification_adjudication_subject s
    join evidence.verification_adjudication_decision d on d.tenant_id=s.tenant_id and d.id=new.decision_id
    where s.tenant_id=new.tenant_id and s.id=new.subject_id
      and s.verification_run_id=new.verification_run_id
      and s.policy_artifact_id=new.policy_artifact_id and s.policy_artifact_sha256=new.policy_artifact_sha256
      and s.packet_sha256=new.packet_sha256
      and s.target_kind=new.override_scope_kind and s.target_id=new.override_scope_id
      and d.subject_id=s.id and d.decision='overturn'
      and (select count(distinct d2.reviewer_actor_id) from evidence.verification_adjudication_decision d2 where d2.tenant_id=s.tenant_id and d2.subject_id=s.id and d2.decision='overturn') >= s.quorum_required
      and not exists(select 1 from evidence.verification_adjudication_decision conflict where conflict.tenant_id=s.tenant_id and conflict.subject_id=s.id and conflict.decision<>'overturn')
  ) then raise exception 'policy override requires a matching overturn adjudication decision and exact subject bindings'
    using errcode='foreign_key_violation'; end if;
  if not orchestration.verification_artifact_is_admitted(new.tenant_id,new.policy_artifact_id,'verification_policy',new.policy_artifact_sha256) then
    raise exception 'policy override requires its exact admitted policy artifact'
      using errcode='foreign_key_violation';
  end if;
  if not orchestration.verification_artifact_is_admitted(new.tenant_id,new.override_artifact_id,'verification_policy_override',new.override_artifact_sha256)
     or not exists(select 1 from orchestration.verification_artifact_metadata m
       join evidence.verification_adjudication_decision d on d.tenant_id=m.tenant_id and d.id=new.decision_id
       where m.tenant_id=new.tenant_id and m.artifact_id=new.override_artifact_id
         and cardinality(m.parent_artifact_ids)=1
         and cardinality(m.parent_artifact_ids)=(select count(distinct parent_id) from unnest(m.parent_artifact_ids) parent_id)
         and m.parent_artifact_ids @> array[d.decision_artifact_id]
         and array[d.decision_artifact_id] @> m.parent_artifact_ids) then
    raise exception 'policy override artifact parent closure differs from its exact decision artifact'
      using errcode='foreign_key_violation';
  end if;
  return new;
end $$;

create trigger verification_adjudication_subject_validate before insert
  on evidence.verification_adjudication_subject for each row
  execute function evidence.validate_verification_adjudication_subject();
create trigger verification_adjudication_decision_validate before insert
  on evidence.verification_adjudication_decision for each row
  execute function evidence.validate_verification_adjudication_decision();
create trigger verification_policy_override_validate before insert
  on evidence.verification_policy_override for each row
  execute function evidence.validate_verification_policy_override();
create trigger verification_adjudicator_grant_validate before insert
  on knowledge_service.verification_adjudicator_grant for each row
  execute function knowledge_service.validate_verification_adjudicator_grant();
create trigger verification_adjudicator_grant_revocation_validate before insert
  on knowledge_service.verification_adjudicator_grant_revocation for each row
  execute function knowledge_service.validate_verification_adjudicator_grant_revocation();
revoke all on function knowledge_service.validate_verification_adjudicator_grant() from public;
revoke all on function knowledge_service.validate_verification_adjudicator_grant_revocation() from public;
revoke all on function evidence.validate_verification_adjudication_subject() from public;
revoke all on function evidence.validate_verification_adjudication_decision() from public;
revoke all on function evidence.validate_verification_policy_override() from public;

do $$ declare target text; parts text[]; begin
  foreach target in array array[
    'knowledge_service.verification_adjudicator_grant',
    'knowledge_service.verification_adjudicator_grant_revocation',
    'evidence.verification_adjudication_subject',
    'evidence.verification_adjudication_decision',
    'evidence.verification_policy_override'
  ] loop
    parts := string_to_array(target,'.');
    execute format('create trigger %I_immutable before update or delete on %I.%I for each row execute function util.reject_mutation()',replace(parts[1]||'_'||parts[2],'.','_'),parts[1],parts[2]);
    execute format('alter table %I.%I enable row level security',parts[1],parts[2]);
  end loop;
end $$;

create policy bounded_role_access on knowledge_service.verification_adjudicator_grant
  for all to verification_adjudicator_grant_admin using (tenant_id=util.current_tenant_id()) with check (tenant_id=util.current_tenant_id());
create policy bounded_role_access on knowledge_service.verification_adjudicator_grant_revocation
  for all to verification_adjudicator_grant_admin using (tenant_id=util.current_tenant_id()) with check (tenant_id=util.current_tenant_id());
create policy bounded_role_access on evidence.verification_adjudication_subject
  for all to executor_service,control_plane using (tenant_id=util.current_tenant_id()) with check (tenant_id=util.current_tenant_id());
create policy bounded_role_access on evidence.verification_adjudication_decision
  for all to verification_adjudicator using (tenant_id=util.current_tenant_id()) with check (tenant_id=util.current_tenant_id());
create policy bounded_role_access on evidence.verification_policy_override
  for all to verification_adjudicator using (tenant_id=util.current_tenant_id()) with check (tenant_id=util.current_tenant_id());

grant select,insert on knowledge_service.verification_adjudicator_grant,knowledge_service.verification_adjudicator_grant_revocation to verification_adjudicator_grant_admin;
grant select,insert on evidence.verification_adjudication_subject to executor_service,control_plane;
grant select,insert on evidence.verification_adjudication_decision,evidence.verification_policy_override to verification_adjudicator;
revoke all on knowledge_service.verification_adjudicator_grant,knowledge_service.verification_adjudicator_grant_revocation from public,anon,authenticated,pipeline_agent,verifier_agent,app_reader,executor_service,control_plane,verification_adjudicator;
revoke all on evidence.verification_adjudication_subject from public,anon,authenticated,pipeline_agent,verifier_agent,app_reader;
revoke all on evidence.verification_adjudication_decision,evidence.verification_policy_override from public,anon,authenticated,pipeline_agent,verifier_agent,app_reader,executor_service,control_plane;
revoke update,delete on knowledge_service.verification_adjudicator_grant,knowledge_service.verification_adjudicator_grant_revocation,evidence.verification_adjudication_subject,evidence.verification_adjudication_decision,evidence.verification_policy_override from executor_service,control_plane,verification_adjudicator_grant_admin,verification_adjudicator;

comment on table evidence.verification_adjudication_subject is
  'Immutable, packet-bound request for human verification adjudication. No decision or policy override is implied.';
comment on table evidence.verification_adjudication_decision is
  'Append-only decision by an active server-admitted human grant, bound to an immutable review packet.';
comment on table evidence.verification_policy_override is
  'Separate append-only derived policy exception. It never rewrites deterministic findings, evidence, or prior policy decisions.';
comment on table knowledge_service.verification_adjudicator_grant is
  'Empty server-maintained human adjudicator allowlist. This migration seeds no actor or role membership; dedicated authenticated server factory provisioning is separate.';

commit;
