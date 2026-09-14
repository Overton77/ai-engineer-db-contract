---
id: "rel:knowledge_service.recovery_case"
kind: table
schema: knowledge_service
name: recovery_case
domain: knowledge-service-runtime
aliases: []
tokens: [knowledge_service, recovery_case, knowledge_service.recovery_case, tenant_id, case_id, initial_batch, authority_handle, authority_digest, revision, state, active_plan_digest, created_at]
summary: null
summary_basis: none
rls: enabled
readers: [executor_service, service_role]
writers: [executor_service, service_role]
typescript: "Database[\"knowledge_service\"][\"Tables\"][\"recovery_case\"][\"Row\"]"
defined_in: ["20260914010700_durable_verification_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.recovery_case

table in domain `knowledge-service-runtime`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `tenant_id` | `uuid` | no | — | PK |
| 2 | `case_id` | `text` | no | — | PK |
| 3 | `initial_batch` | `jsonb` | no | — | — |
| 4 | `authority_handle` | `jsonb` | no | — | — |
| 5 | `authority_digest` | `text` | no | — | — |
| 6 | `revision` | `bigint` | no | `1` | — |
| 7 | `state` | `text` | no | `'ready'::text` | — |
| 8 | `active_plan_digest` | `text` | yes | — | — |
| 9 | `created_at` | `timestamp with time zone` | no | `clock_timestamp()` | — |

## Constraints

- PK (tenant_id, case_id)
- check `recovery_case_authority_digest_check`: `(authority_digest ~ '^sha256:[a-f0-9]{64}$'::text)`
- check `recovery_case_check`: `(NOT ((initial_batch ->> 'tenantId'::text) IS DISTINCT FROM (tenant_id)::text))`
- check `recovery_case_check1`: `(NOT ((initial_batch ->> 'caseId'::text) IS DISTINCT FROM case_id))`
- check `recovery_case_revision_check`: `(revision > 0)`
- check `recovery_case_state_check`: `(state = ANY (ARRAY['ready'::text, 'active'::text, 'waiting'::text, 'complete'::text]))`

## Relationships

Outbound: none.
Inbound: [`knowledge_service.recovery_artifact_reference`](recovery_artifact_reference.md).case_id, [`knowledge_service.recovery_dependency_claim`](recovery_dependency_claim.md).case_id, [`knowledge_service.recovery_original`](recovery_original.md).case_id, [`knowledge_service.recovery_revision`](recovery_revision.md).case_id.

## Indexes

_None._

## Triggers

- `recovery_case_guard` → [`knowledge_service.guard_recovery_case`](../../functions/knowledge_service/guard_recovery_case.md)
- `recovery_case_no_delete` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)

## Row-level security

Enabled.
- `recovery_case_tenant` (ALL) for `executor_service`: `(tenant_id = util.current_tenant_id())`

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `executor_service`.

## Write path

- Direct DML: `executor_service`.

## TypeScript

insert: `Database["knowledge_service"]["Tables"]["recovery_case"]["Insert"]`; row: `Database["knowledge_service"]["Tables"]["recovery_case"]["Row"]`; update: `Database["knowledge_service"]["Tables"]["recovery_case"]["Update"]`

Defined in: `20260914010700_durable_verification_recovery.sql`.
