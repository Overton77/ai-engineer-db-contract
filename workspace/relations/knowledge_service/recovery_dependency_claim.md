---
id: "rel:knowledge_service.recovery_dependency_claim"
kind: table
schema: knowledge_service
name: recovery_dependency_claim
domain: knowledge-service-runtime
aliases: []
tokens: [knowledge_service, recovery_dependency_claim, knowledge_service.recovery_dependency_claim, tenant_id, dependency_key, case_id, plan_digest, holder_identity, claim_token, fencing_token, expires_at, released_at]
summary: null
summary_basis: none
rls: enabled
readers: [executor_service, service_role]
writers: [executor_service, service_role]
typescript: "Database[\"knowledge_service\"][\"Tables\"][\"recovery_dependency_claim\"][\"Row\"]"
defined_in: ["20260914010700_durable_verification_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.recovery_dependency_claim

table in domain `knowledge-service-runtime`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `tenant_id` | `uuid` | no | — | PK |
| 2 | `dependency_key` | `text` | no | — | PK |
| 3 | `case_id` | `text` | no | — | — |
| 4 | `plan_digest` | `text` | no | — | — |
| 5 | `holder_identity` | `text` | no | — | — |
| 6 | `claim_token` | `uuid` | no | — | — |
| 7 | `fencing_token` | `bigint` | no | — | — |
| 8 | `expires_at` | `timestamp with time zone` | no | — | — |
| 9 | `released_at` | `timestamp with time zone` | yes | — | — |

## Constraints

- PK (tenant_id, dependency_key)
- check `recovery_dependency_claim_check`: `((fencing_token > 0) AND (length(holder_identity) > 0))`

## Relationships

Outbound: `tenant_id,case_id` → [`knowledge_service.recovery_case`](recovery_case.md)`.tenant_id,case_id`.
Inbound: none.

## Indexes

_None._

## Triggers

_None._

## Row-level security

Enabled.
- `recovery_dependency_claim_tenant` (ALL) for `executor_service`: `(tenant_id = util.current_tenant_id())`

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `executor_service`.

## Write path

- Direct DML: `executor_service`.

## TypeScript

insert: `Database["knowledge_service"]["Tables"]["recovery_dependency_claim"]["Insert"]`; row: `Database["knowledge_service"]["Tables"]["recovery_dependency_claim"]["Row"]`; update: `Database["knowledge_service"]["Tables"]["recovery_dependency_claim"]["Update"]`

Defined in: `20260914010700_durable_verification_recovery.sql`.
