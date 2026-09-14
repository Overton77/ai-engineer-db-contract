---
id: "rel:knowledge_service.recovery_revision"
kind: table
schema: knowledge_service
name: recovery_revision
domain: knowledge-service-runtime
aliases: []
tokens: [knowledge_service, recovery_revision, knowledge_service.recovery_revision, tenant_id, case_id, revision, kind, idempotency_key, artifact_id, artifact_handle, payload, checkpoint_id, recorded_at]
summary: null
summary_basis: none
rls: enabled
readers: [executor_service, service_role]
writers: [executor_service, service_role]
typescript: "Database[\"knowledge_service\"][\"Tables\"][\"recovery_revision\"][\"Row\"]"
defined_in: ["20260914010700_durable_verification_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.recovery_revision

table in domain `knowledge-service-runtime`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `tenant_id` | `uuid` | no | — | PK; unique (tenant_id, case_id, kind, idempotency_key) |
| 2 | `case_id` | `text` | no | — | PK; unique (tenant_id, case_id, kind, idempotency_key) |
| 3 | `revision` | `bigint` | no | — | PK |
| 4 | `kind` | `text` | no | — | unique (tenant_id, case_id, kind, idempotency_key) |
| 5 | `idempotency_key` | `text` | no | — | unique (tenant_id, case_id, kind, idempotency_key) |
| 6 | `artifact_id` | `uuid` | no | — | — |
| 7 | `artifact_handle` | `jsonb` | no | — | — |
| 8 | `payload` | `jsonb` | no | — | — |
| 9 | `checkpoint_id` | `uuid` | yes | — | — |
| 10 | `recorded_at` | `timestamp with time zone` | no | `clock_timestamp()` | — |

## Constraints

- PK (tenant_id, case_id, revision)
- unique (tenant_id, case_id, kind, idempotency_key)
- check `recovery_revision_check`: `(NOT ((artifact_handle ->> 'artifactId'::text) IS DISTINCT FROM (artifact_id)::text))`
- check `recovery_revision_check1`: `(NOT ((artifact_handle ->> 'tenantId'::text) IS DISTINCT FROM (tenant_id)::text))`
- check `recovery_revision_check2`: `((kind = 'wait'::text) = (checkpoint_id IS NOT NULL))`
- check `recovery_revision_kind_check`: `(kind = ANY (ARRAY['batch'::text, 'notification'::text, 'failure_set'::text, 'plan'::text, 'invalidation'::text, 'receipt'::text, 'wait'::t…`

## Relationships

Outbound: `tenant_id,artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id`; `tenant_id,case_id` → [`knowledge_service.recovery_case`](recovery_case.md)`.tenant_id,case_id`; `tenant_id,checkpoint_id` → [`knowledge_service.scoped_checkpoint`](scoped_checkpoint.md)`.tenant_id,id`.
Inbound: none.

## Indexes

`recovery_revision_tenant_id_case_id_kind_idempotency_key_key` unique

## Triggers

- `recovery_revision_artifact_guard` → [`knowledge_service.guard_recovery_revision_artifact`](../../functions/knowledge_service/guard_recovery_revision_artifact.md)
- `recovery_revision_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)
- `recovery_revision_retirement_guard` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)

## Row-level security

Enabled.
- `recovery_revision_tenant` (ALL) for `executor_service`: `(tenant_id = util.current_tenant_id())`

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `executor_service`.

## Write path

- Direct DML: `executor_service`.

## TypeScript

insert: `Database["knowledge_service"]["Tables"]["recovery_revision"]["Insert"]`; row: `Database["knowledge_service"]["Tables"]["recovery_revision"]["Row"]`; update: `Database["knowledge_service"]["Tables"]["recovery_revision"]["Update"]`

Defined in: `20260914010700_durable_verification_recovery.sql`.
