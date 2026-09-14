---
id: "rel:orchestration.verification_component_drift_observation"
kind: table
schema: orchestration
name: verification_component_drift_observation
domain: orchestration-ledger
aliases: []
tokens: [orchestration, verification_component_drift_observation, orchestration.verification_component_drift_observation, tenant_id, observation_artifact_id, observation_sha256, payload_sha256, baseline_run_id, baseline_audit_artifact_id, baseline_audit_sha256, candidate_run_id, candidate_audit_artifact_id, candidate_audit_sha256, source_operation_id, dimensions, idempotency_key, created_at]
summary: null
summary_basis: none
rls: enabled
readers: [app_reader, control_plane, executor_service, service_role]
writers: []
typescript: "Database[\"orchestration\"][\"Tables\"][\"verification_component_drift_observation\"][\"Row\"]"
defined_in: ["20260908030000_verification_drift_revalidation_outbox.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.verification_component_drift_observation

table in domain `orchestration-ledger`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `tenant_id` | `uuid` | no | `util.default_tenant_id()` | PK; unique (tenant_id, idempotency_key) |
| 2 | `observation_artifact_id` | `uuid` | no | — | PK |
| 3 | `observation_sha256` | `text` | no | — | — |
| 4 | `payload_sha256` | `text` | no | — | — |
| 5 | `baseline_run_id` | `uuid` | no | — | — |
| 6 | `baseline_audit_artifact_id` | `uuid` | no | — | — |
| 7 | `baseline_audit_sha256` | `text` | no | — | — |
| 8 | `candidate_run_id` | `uuid` | no | — | — |
| 9 | `candidate_audit_artifact_id` | `uuid` | no | — | — |
| 10 | `candidate_audit_sha256` | `text` | no | — | — |
| 11 | `source_operation_id` | `uuid` | no | — | — |
| 12 | `dimensions` | `text[]` | no | — | — |
| 13 | `idempotency_key` | `text` | no | — | unique (tenant_id, idempotency_key) |
| 14 | `created_at` | `timestamp with time zone` | no | `clock_timestamp()` | — |

## Constraints

- PK (tenant_id, observation_artifact_id)
- unique (tenant_id, idempotency_key)
- check `verification_component_drift_obser_candidate_audit_sha256_check`: `(candidate_audit_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_component_drift_observ_baseline_audit_sha256_check`: `(baseline_audit_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_component_drift_observati_observation_sha256_check`: `(observation_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_component_drift_observation_check`: `((baseline_run_id <> candidate_run_id) AND (baseline_audit_artifact_id <> candidate_audit_artifact_id))`
- check `verification_component_drift_observation_dimensions_check`: `(((cardinality(dimensions) >= 1) AND (cardinality(dimensions) <= 5)) AND (dimensions <@ ARRAY['provider'::text, 'model'::text, 'parser'::te…`
- check `verification_component_drift_observation_idempotency_key_check`: `((length(btrim(idempotency_key)) >= 1) AND (length(btrim(idempotency_key)) <= 256))`
- check `verification_component_drift_observation_payload_sha256_check`: `(payload_sha256 ~ '^[0-9a-f]{64}$'::text)`

## Relationships

Outbound: `tenant_id,baseline_audit_artifact_id` → [`orchestration.artifact`](artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,candidate_audit_artifact_id` → [`orchestration.artifact`](artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,observation_artifact_id` → [`orchestration.artifact`](artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,source_operation_id` → [`knowledge_service.operation`](../knowledge_service/operation.md)`.tenant_id,id` on delete restrict; `tenant_id,candidate_run_id` → [`evidence.verification_run`](../evidence/verification_run.md)`.tenant_id,id` on delete restrict; `tenant_id,baseline_run_id` → [`evidence.verification_run`](../evidence/verification_run.md)`.tenant_id,id` on delete restrict.
Inbound: none.

## Indexes

`verification_component_drift_obse_tenant_id_idempotency_key_key` unique

## Triggers

- `artifact_retirement_08de51ea24330b7b947fea23` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `artifact_retirement_7e27a7ba0e396b55e8c9889d` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `artifact_retirement_a07a459d2c7a545095a448e6` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `verification_component_drift_observation_immutable` → [`orchestration.verification_component_drift_observation_immutable`](../../functions/orchestration/verification_component_drift_observation_immutable.md)

## Row-level security

Enabled.
- `verification_component_drift_observation_reader` (SELECT) for `app_reader`: `(tenant_id = util.current_tenant_id())`
- `verification_component_drift_observation_worker` (SELECT) for `control_plane`, `executor_service`: `(tenant_id = util.current_tenant_id())`

## Grants

`app_reader`: SELECT; `control_plane`: SELECT; `executor_service`: SELECT; `service_role`: SELECT. None: `anon`, `authenticated`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `app_reader`, `control_plane`, `executor_service`.

## Write path

- No direct DML for any agent role.
- Via functions (best effort): [`orchestration.publish_verification_component_drift_observation`](../../functions/orchestration/publish_verification_component_drift_observation.md).

## TypeScript

insert: `Database["orchestration"]["Tables"]["verification_component_drift_observation"]["Insert"]`; row: `Database["orchestration"]["Tables"]["verification_component_drift_observation"]["Row"]`; update: `Database["orchestration"]["Tables"]["verification_component_drift_observation"]["Update"]`

Defined in: `20260908030000_verification_drift_revalidation_outbox.sql`.
