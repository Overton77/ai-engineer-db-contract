-- DRAFT ONLY — NOT A CANONICAL MIGRATION; DO NOT APPLY.
--
-- Candidate extension for a future semantic phase inside the existing
-- verification_claims / verification_report operations. It deliberately does
-- not add a standalone verification_semantic operation. The exact operation
-- tuples below are present in KS surface.ts today:
--   verification_claims / verify_claims_and_register
--   verification_report / verify_report_and_register
--
-- Preconditions before promotion are listed in the companion dependency note.
-- In particular, no current public request or result contract represents a
-- semantic phase, a semantic profile, a blinded-input artifact, or an
-- observation artifact. This text cannot be applied safely until those
-- contracts and the artifact builder exist.

-- 1. Artifact vocabulary must be append-only. Promotion must fail if an
-- existing description differs; do not use ON CONFLICT DO UPDATE.
insert into orchestration.artifact_type(code, description) values
  ('verification_semantic_judge_profile', 'Immutable server-owned semantic judge profile'),
  ('verification_semantic_blinded_input', 'Immutable blinded authorized semantic judge input'),
  ('verification_semantic_response_observation', 'Immutable semantic provider response observation bound to raw response custody');

-- 2. The existing provider-attempt scope trigger must be replaced as a whole,
-- preserving its extraction branch byte-for-byte in behavior. The proposed
-- tuple predicate is intentionally closed, not caller supplied:
--
-- case
--   when operation.operation_kind='verification_structured_extraction'
--     then step.step_key='extract_and_register'
--      and verification_artifact_is_admitted(tenant, profile,
--          'verification_structured_extraction_profile', profile_sha)
--   when operation.operation_kind='verification_claims'
--     then step.step_key='verify_claims_and_register'
--      and verification_artifact_is_admitted(tenant, profile,
--          'verification_semantic_judge_profile', profile_sha)
--   when operation.operation_kind='verification_report'
--     then step.step_key='verify_report_and_register'
--      and verification_artifact_is_admitted(tenant, profile,
--          'verification_semantic_judge_profile', profile_sha)
--   else false
-- end
--
-- It must still lock operation+step+lease, require status running, require the
-- current verification.provider_claim values, compare reserve/dispatch fences,
-- and call verification_provider_artifacts_are_admitted for request/response.
-- The current 20260906031300 trigger hard-codes extraction; a permissive
-- operation-kind parameter or a generic step fallback is forbidden.

-- 3. Candidate append-only observation relation. The definitive migration must
-- use the current artifact metadata relation to verify the exact parent vector
-- and transform signature. The artifact columns below are intentional: digest
-- fields are repeated only so trigger comparisons do not trust caller JSON.
create table orchestration.verification_semantic_response_observation (
  tenant_id uuid not null,
  provider_attempt_id uuid not null,
  operation_id uuid not null,
  operation_step_id uuid not null,
  profile_artifact_id uuid not null,
  profile_sha256 text not null check(profile_sha256 ~ '^[0-9a-f]{64}$'),
  dispatch_fencing_token bigint not null check(dispatch_fencing_token > 0),
  blinded_input_artifact_id uuid not null,
  blinded_input_sha256 text not null check(blinded_input_sha256 ~ '^[0-9a-f]{64}$'),
  request_artifact_id uuid not null,
  request_sha256 text not null check(request_sha256 ~ '^[0-9a-f]{64}$'),
  raw_response_artifact_id uuid not null,
  raw_response_sha256 text not null check(raw_response_sha256 ~ '^[0-9a-f]{64}$'),
  observation_artifact_id uuid not null,
  observation_sha256 text not null check(observation_sha256 ~ '^[0-9a-f]{64}$'),
  requested_model text not null check(requested_model ~ '^[A-Za-z0-9_./:-]{1,255}$'),
  observed_model text check(observed_model is null or observed_model ~ '^[A-Za-z0-9_./:-]{1,255}$'),
  model_status text not null check(model_status in ('matched','missing','mismatch')),
  revalidation_required boolean not null,
  prompt_tokens integer check(prompt_tokens is null or prompt_tokens between 0 and 2000000),
  completion_tokens integer check(completion_tokens is null or completion_tokens between 0 and 2000000),
  total_tokens integer check(total_tokens is null or total_tokens between 0 and 4000000),
  reported_cost_status text not null check(reported_cost_status in ('reported','unknown')),
  reported_cost_micros bigint check(reported_cost_micros is null or reported_cost_micros between 0 and 2000000000),
  recorded_at timestamptz not null default clock_timestamp(),
  primary key(tenant_id, provider_attempt_id),
  foreign key(tenant_id,provider_attempt_id) references orchestration.verification_provider_attempt(tenant_id,id) on delete restrict,
  foreign key(tenant_id,operation_id) references knowledge_service.operation(tenant_id,id) on delete restrict,
  foreign key(tenant_id,operation_step_id) references knowledge_service.operation_step(tenant_id,id) on delete restrict,
  foreign key(tenant_id,profile_artifact_id) references orchestration.artifact(tenant_id,id) on delete restrict,
  foreign key(tenant_id,blinded_input_artifact_id) references orchestration.artifact(tenant_id,id) on delete restrict,
  foreign key(tenant_id,request_artifact_id) references orchestration.artifact(tenant_id,id) on delete restrict,
  foreign key(tenant_id,raw_response_artifact_id) references orchestration.artifact(tenant_id,id) on delete restrict,
  foreign key(tenant_id,observation_artifact_id) references orchestration.artifact(tenant_id,id) on delete restrict,
  check((model_status='matched' and observed_model=requested_model and not revalidation_required)
     or (model_status='missing' and observed_model is null and revalidation_required)
     or (model_status='mismatch' and observed_model is not null and observed_model<>requested_model and revalidation_required)),
  check((reported_cost_status='reported' and reported_cost_micros is not null)
     or (reported_cost_status='unknown' and reported_cost_micros is null)),
  check(total_tokens is null or (prompt_tokens is null or total_tokens>=prompt_tokens)
     and (completion_tokens is null or total_tokens>=completion_tokens))
);

-- 4. Required BEFORE INSERT trigger, specified rather than supplied as unsafe
-- incomplete SQL. It must: set recorded_at=clock_timestamp(); reject updates
-- and deletes; set and validate the same live provider claim as the attempt;
-- lock provider attempt, operation, step, and lease; allow only the two claim
-- / report tuples above; compare every tenant/operation/step/profile/fence/
-- request field to the provider attempt; require state in dispatched/uncertain/
-- settled; require an admitted semantic blinded-input artifact, request, raw
-- response, and observation artifact; prove the response envelope has exactly
-- [request_artifact_id, raw_response_artifact_id] parents; and prove the
-- observation artifact has the exact canonical parent vector
-- [blinded_input_artifact_id, response_envelope_artifact_id, profile_artifact_id]
-- plus a transformation signature recomputed from every immutable table field.
--
-- DB cannot parse private Storage bytes. The missing semantic observation
-- artifact contract/builder must canonicalize its body and transformation
-- signature from these same fields before registration. The trigger must reject
-- any missing or unequal signature; it must not treat a raw digest as proof of
-- a parsed model string.

-- 5. Required security: enable RLS; tenant worker INSERT/SELECT only for the
-- dedicated executor/verifier roles; app_reader SELECT only; revoke all from
-- public/anon/authenticated; no grant to service_role and no self-grant. The
-- table and trigger must retain no UPDATE/DELETE path and no ON CONFLICT UPDATE.
-- Existing extraction response-capture and reconciliation privileges must stay
-- unchanged.
