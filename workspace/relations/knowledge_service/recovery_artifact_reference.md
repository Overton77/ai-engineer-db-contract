---
id: "rel:knowledge_service.recovery_artifact_reference"
kind: table
schema: knowledge_service
name: recovery_artifact_reference
domain: knowledge-service-runtime
aliases: []
tokens: [knowledge_service, recovery_artifact_reference, knowledge_service.recovery_artifact_reference, tenant_id, case_id, artifact_id]
summary: null
summary_basis: none
rls: enabled
readers: [executor_service, service_role]
writers: [executor_service, service_role]
typescript: "Database[\"knowledge_service\"][\"Tables\"][\"recovery_artifact_reference\"][\"Row\"]"
defined_in: ["20260914010700_durable_verification_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.recovery_artifact_reference

table in domain `knowledge-service-runtime`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `tenant_id` | `uuid` | no | — | PK |
| 2 | `case_id` | `text` | no | — | PK |
| 3 | `artifact_id` | `uuid` | no | — | PK |

## Constraints

- PK (tenant_id, case_id, artifact_id)

## Relationships

Outbound: `tenant_id,artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id`; `tenant_id,case_id` → [`knowledge_service.recovery_case`](recovery_case.md)`.tenant_id,case_id`.
Inbound: none.

## Indexes

_None._

## Triggers

- `recovery_artifact_reference_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)
- `recovery_artifact_reference_retirement_guard` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)

## Row-level security

Enabled.
- `recovery_artifact_reference_tenant` (ALL) for `executor_service`: `(tenant_id = util.current_tenant_id())`

## Grants

`executor_service`: INSERT, SELECT; `service_role`: INSERT, SELECT. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `executor_service`.

## Write path

- Direct DML: `executor_service`.

## TypeScript

insert: `Database["knowledge_service"]["Tables"]["recovery_artifact_reference"]["Insert"]`; row: `Database["knowledge_service"]["Tables"]["recovery_artifact_reference"]["Row"]`; update: `Database["knowledge_service"]["Tables"]["recovery_artifact_reference"]["Update"]`

Defined in: `20260914010700_durable_verification_recovery.sql`.
