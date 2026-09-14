---
id: "rel:orchestration.verification_drift_revalidation_outbox"
kind: table
schema: orchestration
name: verification_drift_revalidation_outbox
domain: orchestration-ledger
aliases: []
tokens: [orchestration, verification_drift_revalidation_outbox, orchestration.verification_drift_revalidation_outbox, id, tenant_id, observation_artifact_id, observation_sha256, source_operation_id, idempotency_key, dimensions, disposition, review_reason, state, claim_owner, claim_token, claimed_at, visibility_expires_at, delivery_attempts, available_at, published_at, archived_at, last_error, created_at]
summary: null
summary_basis: none
rls: enabled
readers: [control_plane, executor_service, service_role]
writers: []
typescript: "Database[\"orchestration\"][\"Tables\"][\"verification_drift_revalidation_outbox\"][\"Row\"]"
defined_in: ["20260908030000_verification_drift_revalidation_outbox.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.verification_drift_revalidation_outbox

table in domain `orchestration-ledger`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK; unique (tenant_id, id) |
| 2 | `tenant_id` | `uuid` | no | `util.default_tenant_id()` | unique (tenant_id, observation_artifact_id); unique (tenant_id, idempotency_key); unique (tenant_id, id) |
| 3 | `observation_artifact_id` | `uuid` | no | — | unique (tenant_id, observation_artifact_id) |
| 4 | `observation_sha256` | `text` | no | — | — |
| 5 | `source_operation_id` | `uuid` | no | — | — |
| 6 | `idempotency_key` | `text` | no | — | unique (tenant_id, idempotency_key) |
| 7 | `dimensions` | `text[]` | no | — | — |
| 8 | `disposition` | `text` | no | — | — |
| 9 | `review_reason` | `text` | yes | — | — |
| 10 | `state` | `text` | no | `'pending'::text` | — |
| 11 | `claim_owner` | `text` | yes | — | — |
| 12 | `claim_token` | `uuid` | yes | — | — |
| 13 | `claimed_at` | `timestamp with time zone` | yes | — | — |
| 14 | `visibility_expires_at` | `timestamp with time zone` | yes | — | — |
| 15 | `delivery_attempts` | `integer` | no | `0` | — |
| 16 | `available_at` | `timestamp with time zone` | no | `clock_timestamp()` | — |
| 17 | `published_at` | `timestamp with time zone` | yes | — | — |
| 18 | `archived_at` | `timestamp with time zone` | yes | — | — |
| 19 | `last_error` | `text` | yes | — | — |
| 20 | `created_at` | `timestamp with time zone` | no | `clock_timestamp()` | — |

## Constraints

- PK (id)
- unique (tenant_id, observation_artifact_id)
- unique (tenant_id, idempotency_key)
- unique (tenant_id, id)
- 12 check constraints; see [details](verification_drift_revalidation_outbox.details.md)

## Relationships

2 outbound and 0 inbound foreign keys; full list in [details](verification_drift_revalidation_outbox.details.md).

## Indexes

4 indexes; see [details](verification_drift_revalidation_outbox.details.md).

## Triggers

1 triggers; see [details](verification_drift_revalidation_outbox.details.md).

## Row-level security

Enabled; 1 policies in [details](verification_drift_revalidation_outbox.details.md).

## Grants

`control_plane`: SELECT; `executor_service`: SELECT; `service_role`: SELECT. None: `anon`, `app_reader`, `authenticated`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `control_plane`, `executor_service`.

## Write path

- No direct DML for any agent role.
- Via functions (best effort): [`orchestration.ack_verification_drift_revalidation`](../../functions/orchestration/ack_verification_drift_revalidation.md), [`orchestration.claim_verification_drift_revalidation`](../../functions/orchestration/claim_verification_drift_revalidation.md), [`orchestration.plan_verification_drift_revalidation`](../../functions/orchestration/plan_verification_drift_revalidation.md), [`orchestration.publish_verification_component_drift_observation`](../../functions/orchestration/publish_verification_component_drift_observation.md).

## TypeScript

insert: `Database["orchestration"]["Tables"]["verification_drift_revalidation_outbox"]["Insert"]`; row: `Database["orchestration"]["Tables"]["verification_drift_revalidation_outbox"]["Row"]`; update: `Database["orchestration"]["Tables"]["verification_drift_revalidation_outbox"]["Update"]`

Defined in: `20260908030000_verification_drift_revalidation_outbox.sql`.
