---
id: "rel:knowledge_service.recovery_original"
kind: table
schema: knowledge_service
name: recovery_original
domain: knowledge-service-runtime
aliases: []
tokens: [knowledge_service, recovery_original, knowledge_service.recovery_original, tenant_id, case_id, original_id, original_operation_id, original_input_digest, used_rounds, attempted_input_digests, attempted_repair_digests]
summary: null
summary_basis: none
rls: enabled
readers: [executor_service, service_role]
writers: [executor_service, service_role]
typescript: "Database[\"knowledge_service\"][\"Tables\"][\"recovery_original\"][\"Row\"]"
defined_in: ["20260914010700_durable_verification_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.recovery_original

table in domain `knowledge-service-runtime`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `tenant_id` | `uuid` | no | — | PK; unique (tenant_id, original_operation_id, original_input_digest) |
| 2 | `case_id` | `text` | no | — | PK |
| 3 | `original_id` | `text` | no | — | PK |
| 4 | `original_operation_id` | `uuid` | no | — | unique (tenant_id, original_operation_id, original_input_digest) |
| 5 | `original_input_digest` | `text` | no | — | unique (tenant_id, original_operation_id, original_input_digest) |
| 6 | `used_rounds` | `integer` | no | — | — |
| 7 | `attempted_input_digests` | `jsonb` | no | `'[]'::jsonb` | — |
| 8 | `attempted_repair_digests` | `jsonb` | no | `'[]'::jsonb` | — |

## Constraints

- PK (tenant_id, case_id, original_id)
- unique (tenant_id, original_operation_id, original_input_digest)
- check `recovery_original_check`: `((jsonb_typeof(attempted_input_digests) = 'array'::text) AND (jsonb_typeof(attempted_repair_digests) = 'array'::text))`
- check `recovery_original_original_input_digest_check`: `(original_input_digest ~ '^sha256:[a-f0-9]{64}$'::text)`
- check `recovery_original_used_rounds_check`: `((used_rounds >= 0) AND (used_rounds <= 2))`

## Relationships

Outbound: `tenant_id,case_id` → [`knowledge_service.recovery_case`](recovery_case.md)`.tenant_id,case_id`; `tenant_id,original_operation_id` → [`knowledge_service.operation`](operation.md)`.tenant_id,id`.
Inbound: [`knowledge_service.recovery_execution`](recovery_execution.md).case_id,original_id.

## Indexes

`recovery_original_tenant_id_original_operation_id_original__key` unique

## Triggers

- `recovery_original_guard` → [`knowledge_service.guard_recovery_original`](../../functions/knowledge_service/guard_recovery_original.md)
- `recovery_original_no_delete` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)

## Row-level security

Enabled.
- `recovery_original_tenant` (ALL) for `executor_service`: `(tenant_id = util.current_tenant_id())`

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `executor_service`.

## Write path

- Direct DML: `executor_service`.

## TypeScript

insert: `Database["knowledge_service"]["Tables"]["recovery_original"]["Insert"]`; row: `Database["knowledge_service"]["Tables"]["recovery_original"]["Row"]`; update: `Database["knowledge_service"]["Tables"]["recovery_original"]["Update"]`

Defined in: `20260914010700_durable_verification_recovery.sql`.
