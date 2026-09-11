-- DRAFT ONLY. Authority ledger candidate; never place under supabase/migrations without contract/runtime review.
-- This preserves evidence.verification_adjudication_subject and creates no admin, reviewer, decision, or override row.
-- A migration owner must separately enroll a real human policy administrator before the isolated writer role is useful.

do $$ begin
  if not exists (select 1 from pg_roles where rolname='verification_adjudication_authority_writer') then
    create role verification_adjudication_authority_writer nologin noinherit;
  end if;
exception when insufficient_privilege then
  raise exception 'verification adjudication authority writer provisioning requires migration-owner privilege';
end $$;

grant usage on schema knowledge_service, evidence, orchestration, util to verification_adjudication_authority_writer;

-- Empty root of trust. No application role may populate or mutate it. A future reviewed
-- migration-owner ceremony must name a real human administrator and a bounded expiry.
create table knowledge_service.verification_adjudication_authority_admin (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  actor_id uuid not null,
  actor_kind text not null default 'human' check (actor_kind='human'),
  authority_role text not null check (authority_role='verification_policy_admin'),
  authorization_version text not null check (authorization_version ~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$'),
  valid_from timestamptz not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default clock_timestamp(),
  unique (tenant_id,id),
  unique (tenant_id,actor_id,authorization_version),
  check (expires_at>valid_from and expires_at<=valid_from+interval '90 days')
);

create table knowledge_service.verification_adjudication_authority_admin_revocation (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  admin_authority_id uuid not null,
  reason text not null check (reason=btrim(reason) and char_length(reason) between 1 and 1000),
  revoked_at timestamptz not null,
  created_at timestamptz not null default clock_timestamp(),
  unique (tenant_id,id),
  unique (tenant_id,admin_authority_id),
  foreign key (tenant_id,admin_authority_id) references knowledge_service.verification_adjudication_authority_admin(tenant_id,id) on delete restrict
);

-- One authority grant is for one immutable subject, packet, human, role, and version.
-- A role name never contributes more than one vote; any future quorum must count
-- distinct reviewer_actor_id values among independently recorded decisions.
create table knowledge_service.verification_adjudicator_subject_grant (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  subject_id uuid not null,
  packet_artifact_id uuid not null,
  packet_sha256 text not null check (packet_sha256 ~ '^[0-9a-f]{64}$'),
  reviewer_actor_id uuid not null,
  reviewer_actor_kind text not null default 'human' check (reviewer_actor_kind='human'),
  reviewer_role text not null check (reviewer_role ~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$'),
  authorization_version text not null check (authorization_version ~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$'),
  grantor_admin_authority_id uuid not null,
  grantor_actor_id uuid not null,
  grantor_actor_kind text not null default 'human' check (grantor_actor_kind='human'),
  grant_operation_id uuid not null,
  grant_step_id uuid not null,
  grant_lease_token uuid not null,
  grant_fencing_token bigint not null check (grant_fencing_token>0),
  grant_holder_identity text not null check (grant_holder_identity=btrim(grant_holder_identity) and char_length(grant_holder_identity) between 1 and 255),
  grant_operation_sha256 text not null check (grant_operation_sha256 ~ '^[0-9a-f]{64}$'),
  grant_step_input_sha256 text not null check (grant_step_input_sha256 ~ '^[0-9a-f]{64}$'),
  granted_at timestamptz not null,
  expires_at timestamptz not null,
  created_at timestamptz not null,
  unique (tenant_id,id),
  unique (tenant_id,subject_id,reviewer_actor_id,reviewer_role,authorization_version),
  foreign key (tenant_id,subject_id) references evidence.verification_adjudication_subject(tenant_id,id) on delete restrict,
  foreign key (tenant_id,packet_artifact_id) references orchestration.artifact(tenant_id,id) on delete restrict,
  foreign key (tenant_id,grantor_admin_authority_id) references knowledge_service.verification_adjudication_authority_admin(tenant_id,id) on delete restrict,
  foreign key (tenant_id,grant_operation_id) references knowledge_service.operation(tenant_id,id) on delete restrict,
  foreign key (tenant_id,grant_step_id) references knowledge_service.operation_step(tenant_id,id) on delete restrict,
  check (grantor_actor_id<>reviewer_actor_id),
  check (expires_at>granted_at and expires_at<=granted_at+interval '30 days')
);

create table knowledge_service.verification_adjudicator_subject_grant_revocation (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  grant_id uuid not null,
  subject_id uuid not null,
  packet_artifact_id uuid not null,
  packet_sha256 text not null check (packet_sha256 ~ '^[0-9a-f]{64}$'),
  revoker_admin_authority_id uuid not null,
  revoker_actor_id uuid not null,
  revoker_actor_kind text not null default 'human' check (revoker_actor_kind='human'),
  revoke_operation_id uuid not null,
  revoke_step_id uuid not null,
  revoke_lease_token uuid not null,
  revoke_fencing_token bigint not null check (revoke_fencing_token>0),
  revoke_holder_identity text not null check (revoke_holder_identity=btrim(revoke_holder_identity) and char_length(revoke_holder_identity) between 1 and 255),
  revoke_operation_sha256 text not null check (revoke_operation_sha256 ~ '^[0-9a-f]{64}$'),
  revoke_step_input_sha256 text not null check (revoke_step_input_sha256 ~ '^[0-9a-f]{64}$'),
  reason text not null check (reason=btrim(reason) and char_length(reason) between 1 and 1000),
  revoked_at timestamptz not null,
  created_at timestamptz not null,
  unique (tenant_id,id),
  unique (tenant_id,grant_id),
  foreign key (tenant_id,grant_id) references knowledge_service.verification_adjudicator_subject_grant(tenant_id,id) on delete restrict,
  foreign key (tenant_id,subject_id) references evidence.verification_adjudication_subject(tenant_id,id) on delete restrict,
  foreign key (tenant_id,packet_artifact_id) references orchestration.artifact(tenant_id,id) on delete restrict,
  foreign key (tenant_id,revoker_admin_authority_id) references knowledge_service.verification_adjudication_authority_admin(tenant_id,id) on delete restrict,
  foreign key (tenant_id,revoke_operation_id) references knowledge_service.operation(tenant_id,id) on delete restrict,
  foreign key (tenant_id,revoke_step_id) references knowledge_service.operation_step(tenant_id,id) on delete restrict
);

create index verification_adjudicator_subject_grant_active_idx on knowledge_service.verification_adjudicator_subject_grant(tenant_id,subject_id,reviewer_actor_id,expires_at);
create index verification_adjudicator_subject_grant_revocation_idx on knowledge_service.verification_adjudicator_subject_grant_revocation(tenant_id,grant_id,revoked_at);

create function knowledge_service.validate_verification_adjudication_authority_admin_revocation() returns trigger
language plpgsql security definer set search_path='' as $$
declare target knowledge_service.verification_adjudication_authority_admin%rowtype; observed_at timestamptz;
begin
  select * into target from knowledge_service.verification_adjudication_authority_admin a
    where a.tenant_id=new.tenant_id and a.id=new.admin_authority_id for update;
  if not found then raise exception 'admin authority revocation requires the exact active unrepeated enrollment' using errcode='foreign_key_violation'; end if;
  observed_at:=clock_timestamp();
  if target.expires_at<=observed_at or exists(select 1 from knowledge_service.verification_adjudication_authority_admin_revocation prior
    where prior.tenant_id=new.tenant_id and prior.admin_authority_id=new.admin_authority_id) then
    raise exception 'admin authority revocation requires the exact active unrepeated enrollment' using errcode='foreign_key_violation';
  end if;
  new.revoked_at:=observed_at; new.created_at:=observed_at;
  return new;
end $$;

create function knowledge_service.validate_verification_adjudicator_subject_grant() returns trigger
language plpgsql security definer set search_path='' as $$
declare subject evidence.verification_adjudication_subject%rowtype; admin knowledge_service.verification_adjudication_authority_admin%rowtype; observed_at timestamptz;
begin
  select * into subject from evidence.verification_adjudication_subject s where s.tenant_id=new.tenant_id and s.id=new.subject_id for share;
  if not found or subject.packet_artifact_id<>new.packet_artifact_id or subject.packet_sha256<>new.packet_sha256
    or not new.reviewer_role=any(subject.eligible_reviewer_roles) then
    raise exception 'adjudicator authority requires the exact active subject, packet, and eligible role' using errcode='foreign_key_violation';
  end if;
  select * into admin from knowledge_service.verification_adjudication_authority_admin a
    where a.tenant_id=new.tenant_id and a.id=new.grantor_admin_authority_id and a.actor_kind='human'
      and a.actor_id=new.grantor_actor_id and a.authority_role='verification_policy_admin' for share;
  if not found then raise exception 'adjudicator authority requires an active enrolled human administrator' using errcode='insufficient_privilege'; end if;
  perform 1 from knowledge_service.operation o join knowledge_service.operation_step s on s.tenant_id=o.tenant_id and s.operation_id=o.id
    join knowledge_service.lease l on l.tenant_id=s.tenant_id and l.operation_step_id=s.id
    where o.tenant_id=new.tenant_id and o.id=new.grant_operation_id and s.id=new.grant_step_id
      and l.lease_token=new.grant_lease_token and l.fencing_token=new.grant_fencing_token for update of o,s,l;
  if not found then raise exception 'adjudicator grant lacks its exact human operation, step, and live lease' using errcode='insufficient_privilege'; end if;
  observed_at:=clock_timestamp();
  if (subject.expires_at is not null and (subject.expires_at<=observed_at or new.expires_at>subject.expires_at))
    or admin.valid_from>observed_at or admin.expires_at<=observed_at
    or exists(select 1 from knowledge_service.verification_adjudication_authority_admin_revocation r
      where r.tenant_id=admin.tenant_id and r.admin_authority_id=admin.id and r.revoked_at<=observed_at) then
    raise exception 'adjudicator authority requires active subject and administrator time bounds' using errcode='insufficient_privilege';
  end if;
  new.granted_at:=observed_at; new.created_at:=observed_at;
  if not exists(select 1 from knowledge_service.operation o join knowledge_service.operation_step s on s.tenant_id=o.tenant_id and s.operation_id=o.id
    join knowledge_service.lease l on l.tenant_id=s.tenant_id and l.operation_step_id=s.id
    where o.tenant_id=new.tenant_id and o.id=new.grant_operation_id and o.operation_kind='verification_adjudication_authority' and o.status='running'
      and o.request_sha256=new.grant_operation_sha256 and o.actor_identity='human:'||new.grantor_actor_id::text
      and o.request->>'schemaVersion'='knowledge-operation-request/v1' and o.request->>'kind'='verification_adjudication_authority'
      and o.request #>> '{input,schemaVersion}'='verification-adjudication-authority-request.v1' and o.request #>> '{input,useCase}'='grantAdjudicatorAuthority'
      and o.request #>> '{input,request,subjectId}'=new.subject_id::text and o.request #>> '{input,request,packetArtifact,artifactId}'=new.packet_artifact_id::text
      and o.request #>> '{input,request,packetArtifact,digest}'='sha256:'||new.packet_sha256
      and o.request #>> '{input,request,reviewerActor,kind}'='human' and o.request #>> '{input,request,reviewerActor,id}'=new.reviewer_actor_id::text
      and o.request #>> '{input,request,reviewerRole}'=new.reviewer_role and o.request #>> '{input,request,authorizationVersion}'=new.authorization_version
      and o.request #>> '{input,request,grantorAdminAuthorityId}'=new.grantor_admin_authority_id::text
      and (o.request #>> '{input,request,expiresAt}')::timestamptz=new.expires_at
      and o.request #>> '{authenticatedContext,actor,kind}'='human' and o.request #>> '{authenticatedContext,actor,id}'=new.grantor_actor_id::text
      and o.request #>> '{authenticatedContext,tenantId}'=new.tenant_id::text and o.request #>> '{authenticatedContext,operationId}'=new.grant_operation_id::text
      and o.attempt_id::text=o.request #>> '{authenticatedContext,attemptId}'
      and o.mission_id::text is not distinct from o.request #>> '{authenticatedContext,missionId}'
      and o.work_item_id::text is not distinct from o.request #>> '{authenticatedContext,workItemId}'
      and o.idempotency_key=o.request #>> '{authenticatedContext,idempotencyKey}'
      and s.id=new.grant_step_id and s.step_key='grant_adjudicator_authority' and s.step_kind='grant_adjudicator_authority' and s.status='running'
      and s.input_sha256=new.grant_step_input_sha256 and s.input->'operationInput'=o.request->'input' and s.input->'expectedVersions'=o.request->'expectedVersions' and s.input->'context'=o.request->'authenticatedContext'
      and l.lease_token=new.grant_lease_token and l.fencing_token=new.grant_fencing_token and l.holder_identity=new.grant_holder_identity and l.released_at is null and l.expires_at>observed_at) then
    raise exception 'adjudicator grant lacks its exact human operation, step, and live lease' using errcode='insufficient_privilege';
  end if;
  return new;
end $$;

create function knowledge_service.validate_verification_adjudicator_subject_grant_revocation() returns trigger
language plpgsql security definer set search_path='' as $$
declare target knowledge_service.verification_adjudicator_subject_grant%rowtype; admin knowledge_service.verification_adjudication_authority_admin%rowtype; observed_at timestamptz;
begin
  select * into target from knowledge_service.verification_adjudicator_subject_grant g where g.tenant_id=new.tenant_id and g.id=new.grant_id for update;
  if not found or target.subject_id<>new.subject_id or target.packet_artifact_id<>new.packet_artifact_id or target.packet_sha256<>new.packet_sha256
  then
    raise exception 'adjudicator revocation requires the exact active unrepeated grant' using errcode='foreign_key_violation';
  end if;
  select * into admin from knowledge_service.verification_adjudication_authority_admin a
    where a.tenant_id=new.tenant_id and a.id=new.revoker_admin_authority_id and a.actor_kind='human' and a.actor_id=new.revoker_actor_id
      and a.authority_role='verification_policy_admin' for share;
  if not found then
    raise exception 'adjudicator revocation requires an active enrolled human administrator' using errcode='insufficient_privilege';
  end if;
  perform 1 from knowledge_service.operation o join knowledge_service.operation_step s on s.tenant_id=o.tenant_id and s.operation_id=o.id
    join knowledge_service.lease l on l.tenant_id=s.tenant_id and l.operation_step_id=s.id
    where o.tenant_id=new.tenant_id and o.id=new.revoke_operation_id and s.id=new.revoke_step_id
      and l.lease_token=new.revoke_lease_token and l.fencing_token=new.revoke_fencing_token for update of o,s,l;
  if not found then
    raise exception 'adjudicator revocation lacks its exact human operation, step, and live lease' using errcode='insufficient_privilege';
  end if;
  observed_at:=clock_timestamp();
  if target.expires_at<=observed_at or exists(select 1 from knowledge_service.verification_adjudicator_subject_grant_revocation prior
      where prior.tenant_id=new.tenant_id and prior.grant_id=new.grant_id) then
    raise exception 'adjudicator revocation requires the exact active unrepeated grant' using errcode='foreign_key_violation';
  end if;
  if admin.valid_from>observed_at or admin.expires_at<=observed_at
    or exists(select 1 from knowledge_service.verification_adjudication_authority_admin_revocation r
      where r.tenant_id=admin.tenant_id and r.admin_authority_id=admin.id and r.revoked_at<=observed_at) then
    raise exception 'adjudicator revocation requires an active enrolled human administrator' using errcode='insufficient_privilege';
  end if;
  new.revoked_at:=observed_at; new.created_at:=observed_at;
  if not exists(select 1 from knowledge_service.operation o join knowledge_service.operation_step s on s.tenant_id=o.tenant_id and s.operation_id=o.id
    join knowledge_service.lease l on l.tenant_id=s.tenant_id and l.operation_step_id=s.id
    where o.tenant_id=new.tenant_id and o.id=new.revoke_operation_id and o.operation_kind='verification_adjudication_authority' and o.status='running'
      and o.request_sha256=new.revoke_operation_sha256 and o.actor_identity='human:'||new.revoker_actor_id::text
      and o.request->>'schemaVersion'='knowledge-operation-request/v1' and o.request->>'kind'='verification_adjudication_authority'
      and o.request #>> '{input,schemaVersion}'='verification-adjudication-authority-request.v1' and o.request #>> '{input,useCase}'='revokeAdjudicatorAuthority'
      and o.request #>> '{input,request,grantId}'=new.grant_id::text and o.request #>> '{input,request,subjectId}'=new.subject_id::text
      and o.request #>> '{input,request,packetArtifact,artifactId}'=new.packet_artifact_id::text and o.request #>> '{input,request,packetArtifact,digest}'='sha256:'||new.packet_sha256
      and o.request #>> '{input,request,revokerAdminAuthorityId}'=new.revoker_admin_authority_id::text and o.request #>> '{input,request,reason}'=new.reason
      and o.request #>> '{authenticatedContext,actor,kind}'='human' and o.request #>> '{authenticatedContext,actor,id}'=new.revoker_actor_id::text
      and o.request #>> '{authenticatedContext,tenantId}'=new.tenant_id::text and o.request #>> '{authenticatedContext,operationId}'=new.revoke_operation_id::text
      and o.attempt_id::text=o.request #>> '{authenticatedContext,attemptId}'
      and o.mission_id::text is not distinct from o.request #>> '{authenticatedContext,missionId}'
      and o.work_item_id::text is not distinct from o.request #>> '{authenticatedContext,workItemId}'
      and o.idempotency_key=o.request #>> '{authenticatedContext,idempotencyKey}'
      and s.id=new.revoke_step_id and s.step_key='revoke_adjudicator_authority' and s.step_kind='revoke_adjudicator_authority' and s.status='running'
      and s.input_sha256=new.revoke_step_input_sha256 and s.input->'operationInput'=o.request->'input' and s.input->'expectedVersions'=o.request->'expectedVersions' and s.input->'context'=o.request->'authenticatedContext'
      and l.lease_token=new.revoke_lease_token and l.fencing_token=new.revoke_fencing_token and l.holder_identity=new.revoke_holder_identity and l.released_at is null and l.expires_at>observed_at
    ) then
    raise exception 'adjudicator revocation lacks its exact human operation, step, and live lease' using errcode='insufficient_privilege';
  end if;
  return new;
end $$;

-- Historical decisions consult this predicate at their own immutable observed_at.
-- A later revocation blocks later decisions without rewriting an earlier observation.
create function knowledge_service.verification_adjudicator_subject_grant_is_active(
  p_tenant_id uuid, p_grant_id uuid, p_subject_id uuid, p_actor_id uuid, p_reviewer_role text, p_observed_at timestamptz
) returns boolean language sql stable security definer set search_path='' as $$
  select exists(
    select 1 from knowledge_service.verification_adjudicator_subject_grant g
    join evidence.verification_adjudication_subject s on s.tenant_id=g.tenant_id and s.id=g.subject_id
    where g.tenant_id=p_tenant_id and g.id=p_grant_id and g.subject_id=p_subject_id
      and g.reviewer_actor_kind='human' and g.reviewer_actor_id=p_actor_id and g.reviewer_role=p_reviewer_role
      and g.granted_at<=p_observed_at and g.expires_at>p_observed_at
      and (s.expires_at is null or s.expires_at>p_observed_at)
      and not exists(select 1 from knowledge_service.verification_adjudicator_subject_grant_revocation r
        where r.tenant_id=g.tenant_id and r.grant_id=g.id and r.revoked_at<=p_observed_at)
  )
$$;

create trigger verification_adjudicator_subject_grant_validate before insert on knowledge_service.verification_adjudicator_subject_grant for each row execute function knowledge_service.validate_verification_adjudicator_subject_grant();
create trigger verification_adjudicator_subject_grant_revocation_validate before insert on knowledge_service.verification_adjudicator_subject_grant_revocation for each row execute function knowledge_service.validate_verification_adjudicator_subject_grant_revocation();
create trigger verification_adjudication_authority_admin_revocation_validate before insert on knowledge_service.verification_adjudication_authority_admin_revocation for each row execute function knowledge_service.validate_verification_adjudication_authority_admin_revocation();
create trigger verification_adjudication_authority_admin_immutable before update or delete on knowledge_service.verification_adjudication_authority_admin for each row execute function util.reject_mutation();
create trigger verification_adjudication_authority_admin_revocation_immutable before update or delete on knowledge_service.verification_adjudication_authority_admin_revocation for each row execute function util.reject_mutation();
create trigger verification_adjudicator_subject_grant_immutable before update or delete on knowledge_service.verification_adjudicator_subject_grant for each row execute function util.reject_mutation();
create trigger verification_adjudicator_subject_grant_revocation_immutable before update or delete on knowledge_service.verification_adjudicator_subject_grant_revocation for each row execute function util.reject_mutation();

revoke all on function knowledge_service.validate_verification_adjudicator_subject_grant() from public;
revoke all on function knowledge_service.validate_verification_adjudicator_subject_grant_revocation() from public;
revoke all on function knowledge_service.validate_verification_adjudication_authority_admin_revocation() from public;
revoke all on function knowledge_service.verification_adjudicator_subject_grant_is_active(uuid,uuid,uuid,uuid,text,timestamptz) from public;
alter table knowledge_service.verification_adjudication_authority_admin enable row level security;
alter table knowledge_service.verification_adjudication_authority_admin_revocation enable row level security;
alter table knowledge_service.verification_adjudicator_subject_grant enable row level security;
alter table knowledge_service.verification_adjudicator_subject_grant_revocation enable row level security;
create policy authority_writer_admin_read on knowledge_service.verification_adjudication_authority_admin for select to verification_adjudication_authority_writer using (tenant_id=util.current_tenant_id());
create policy authority_writer_admin_revocation_read on knowledge_service.verification_adjudication_authority_admin_revocation for select to verification_adjudication_authority_writer using (tenant_id=util.current_tenant_id());
create policy authority_writer_grant_access on knowledge_service.verification_adjudicator_subject_grant for all to verification_adjudication_authority_writer using (tenant_id=util.current_tenant_id()) with check (tenant_id=util.current_tenant_id());
create policy authority_writer_revocation_access on knowledge_service.verification_adjudicator_subject_grant_revocation for all to verification_adjudication_authority_writer using (tenant_id=util.current_tenant_id()) with check (tenant_id=util.current_tenant_id());
grant select on knowledge_service.verification_adjudication_authority_admin,knowledge_service.verification_adjudication_authority_admin_revocation to verification_adjudication_authority_writer;
grant select,insert on knowledge_service.verification_adjudicator_subject_grant,knowledge_service.verification_adjudicator_subject_grant_revocation to verification_adjudication_authority_writer;
revoke all on knowledge_service.verification_adjudication_authority_admin,knowledge_service.verification_adjudication_authority_admin_revocation,knowledge_service.verification_adjudicator_subject_grant,knowledge_service.verification_adjudicator_subject_grant_revocation from public,anon,authenticated,pipeline_agent,verifier_agent,app_reader,executor_service,control_plane;
revoke update,delete on knowledge_service.verification_adjudicator_subject_grant,knowledge_service.verification_adjudicator_subject_grant_revocation from verification_adjudication_authority_writer;

comment on table knowledge_service.verification_adjudicator_subject_grant is 'Subject- and packet-bound authority for one explicitly named human reviewer. It records no decision and contributes no vote by itself.';
comment on table knowledge_service.verification_adjudicator_subject_grant_revocation is 'Append-only prospective revocation. It prevents future decisions and does not rewrite earlier observations.';
