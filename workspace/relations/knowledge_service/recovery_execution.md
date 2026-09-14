---
id: "rel:knowledge_service.recovery_execution"
kind: table
schema: knowledge_service
name: recovery_execution
domain: knowledge-service-runtime
aliases: []
tokens: [knowledge_service, recovery_execution, knowledge_service.recovery_execution, tenant_id, execution_id, case_id, original_id, plan_digest, repair_digest, input_digest, planned_operation_id, operation_id, request_digest, reservation_calls, reservation_cost_micros, usage_calls, usage_cost_micros, state, authorization_token, claim_token, claim_fence]
summary: null
summary_basis: none
rls: enabled
readers: [executor_service, service_role]
writers: [executor_service, service_role]
typescript: "Database[\"knowledge_service\"][\"Tables\"][\"recovery_execution\"][\"Row\"]"
defined_in: ["20260914010700_durable_verification_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.recovery_execution

table in domain `knowledge-service-runtime`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `tenant_id` | `uuid` | no | — | PK; unique (tenant_id, case_id, original_id, repair_digest); unique (tenant_id, planned_operation_id) |
| 2 | `execution_id` | `uuid` | no | — | PK |
| 3 | `case_id` | `text` | no | — | unique (tenant_id, case_id, original_id, repair_digest) |
| 4 | `original_id` | `text` | no | — | unique (tenant_id, case_id, original_id, repair_digest) |
| 5 | `plan_digest` | `text` | no | — | — |
| 6 | `repair_digest` | `text` | no | — | unique (tenant_id, case_id, original_id, repair_digest) |
| 7 | `input_digest` | `text` | no | — | — |
| 8 | `planned_operation_id` | `uuid` | no | — | unique (tenant_id, planned_operation_id) |
| 9 | `operation_id` | `uuid` | yes | — | — |
| 10 | `request_digest` | `text` | yes | — | — |
| 11 | `reservation_calls` | `bigint` | no | — | — |
| 12 | `reservation_cost_micros` | `bigint` | no | — | — |
| 13 | `usage_calls` | `bigint` | yes | — | — |
| 14 | `usage_cost_micros` | `bigint` | yes | — | — |
| 15 | `state` | `text` | no | — | — |
| 16 | `authorization_token` | `uuid` | no | — | — |
| 17 | `claim_token` | `uuid` | no | — | — |
| 18 | `claim_fence` | `bigint` | no | — | — |

## Constraints

- PK (tenant_id, execution_id)
- unique (tenant_id, case_id, original_id, repair_digest)
- unique (tenant_id, planned_operation_id)
- check `recovery_execution_check`: `((operation_id IS NULL) OR (operation_id = planned_operation_id))`
- check `recovery_execution_check1`: `((operation_id IS NULL) = (request_digest IS NULL))`
- check `recovery_execution_check2`: `((state = 'authorized'::text) = (operation_id IS NULL))`
- check `recovery_execution_check3`: `((usage_calls IS NULL) = (usage_cost_micros IS NULL))`
- check `recovery_execution_check4`: `((state = 'settled'::text) = ((usage_calls IS NOT NULL) AND (usage_cost_micros IS NOT NULL)))`
- check `recovery_execution_check5`: `((usage_calls IS NULL) OR (usage_calls <= reservation_calls))`
- check `recovery_execution_check6`: `((usage_cost_micros IS NULL) OR (usage_cost_micros <= reservation_cost_micros))`
- check `recovery_execution_check7`: `((plan_digest ~ '^sha256:[a-f0-9]{64}$'::text) AND (repair_digest ~ '^sha256:[a-f0-9]{64}$'::text) AND (input_digest ~ '^sha256:[a-f0-9]{64…`
- check `recovery_execution_claim_fence_check`: `(claim_fence > 0)`
- check `recovery_execution_reservation_calls_check`: `(reservation_calls > 0)`
- check `recovery_execution_reservation_cost_micros_check`: `(reservation_cost_micros >= 0)`
- check `recovery_execution_state_check`: `(state = ANY (ARRAY['authorized'::text, 'linked'::text, 'settled'::text]))`
- check `recovery_execution_usage_calls_check`: `(usage_calls >= 0)`
- check `recovery_execution_usage_cost_micros_check`: `(usage_cost_micros >= 0)`

## Relationships

Outbound: `tenant_id,case_id,original_id` → [`knowledge_service.recovery_original`](recovery_original.md)`.tenant_id,case_id,original_id`; `tenant_id,operation_id` → [`knowledge_service.operation`](operation.md)`.tenant_id,id`.
Inbound: none.

## Indexes

`recovery_execution_tenant_id_case_id_original_id_repair_dig_key` unique; `recovery_execution_tenant_id_planned_operation_id_key` unique

## Triggers

- `recovery_execution_guard` → [`knowledge_service.guard_recovery_execution`](../../functions/knowledge_service/guard_recovery_execution.md)
- `recovery_execution_no_delete` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)

## Row-level security

Enabled.
- `recovery_execution_tenant` (ALL) for `executor_service`: `(tenant_id = util.current_tenant_id())`

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `executor_service`.

## Write path

- Direct DML: `executor_service`.

## TypeScript

insert: `Database["knowledge_service"]["Tables"]["recovery_execution"]["Insert"]`; row: `Database["knowledge_service"]["Tables"]["recovery_execution"]["Row"]`; update: `Database["knowledge_service"]["Tables"]["recovery_execution"]["Update"]`

Defined in: `20260914010700_durable_verification_recovery.sql`.
