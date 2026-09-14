---
id: "rel:orchestration.operation_intent"
kind: table
schema: orchestration
name: operation_intent
domain: orchestration-ledger
aliases: [intent]
tokens: [orchestration, operation_intent, orchestration.operation_intent, id, tenant_id, intent_type, schema_version, payload, preconditions, idempotency_key, proposed_by_attempt, mission_id, approval_state, policy_decision, created_at]
summary: Durable proposed operation with unique idempotency_key.
summary_basis: curated
rls: enabled
readers: [control_plane, executor_service, pipeline_agent, service_role]
writers: [control_plane, executor_service, pipeline_agent, service_role]
typescript: "Database[\"orchestration\"][\"Tables\"][\"operation_intent\"][\"Row\"]"
defined_in: ["20260826000200_orchestration.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.operation_intent

table in domain `orchestration-ledger`.

> curated (model_assisted, unreviewed) — Durable proposed operation with unique idempotency_key.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK |
| 2 | `tenant_id` | `uuid` | no | `util.default_tenant_id()` | — |
| 3 | `intent_type` | `text` | no | — | FK → [`orchestration.intent_type`](intent_type.md).code; _curated:_ FK to orchestration.intent_type; knowledge_ingestion is the workspace write. |
| 4 | `schema_version` | `integer` | no | `1` | — |
| 5 | `payload` | `jsonb` | no | — | — |
| 6 | `preconditions` | `jsonb` | no | `'{}'::jsonb` | _curated:_ Includes expectedKnowledgeHead and snapshotDigest. |
| 7 | `idempotency_key` | `text` | no | — | unique (idempotency_key); _curated:_ Unique; duplicate submits return duplicate_of. |
| 8 | `proposed_by_attempt` | `uuid` | yes | — | FK → [`orchestration.attempt`](attempt.md).id |
| 9 | `mission_id` | `uuid` | yes | — | FK → [`orchestration.mission`](mission.md).id |
| 10 | `approval_state` | `text` | no | `'pending'::text` | — |
| 11 | `policy_decision` | `jsonb` | yes | — | — |
| 12 | `created_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (id)
- unique (idempotency_key)
- check `operation_intent_approval_state_check`: `(approval_state = ANY (ARRAY['pending'::text, 'approved'::text, 'budgeted'::text, 'denied'::text, 'escalated'::text]))`

## Relationships

Outbound: `intent_type` → [`orchestration.intent_type`](intent_type.md)`.code`; `mission_id` → [`orchestration.mission`](mission.md)`.id` on delete set null; `proposed_by_attempt` → [`orchestration.attempt`](attempt.md)`.id`.
Inbound: [`evaluation.review_task`](../evaluation/review_task.md).operation_intent_id, [`orchestration.operation_receipt`](operation_receipt.md).intent_id, [`research.report_ingestion_link`](../research/report_ingestion_link.md).intent_id.
Polymorphic target of: [`evaluation.review_task`](../evaluation/review_task.md) (check constraint review_task_exactly_one_subject).

## Indexes

`operation_intent_idempotency_key_key` unique; `operation_intent_mission_idx`; `operation_intent_state_idx`

## Triggers

_None._

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `(tenant_id = util.current_tenant_id())`

## Grants

`control_plane`: INSERT, SELECT, UPDATE; `executor_service`: INSERT, SELECT; `pipeline_agent`: INSERT, SELECT; `service_role`: INSERT, SELECT, UPDATE. None: `anon`, `app_reader`, `authenticated`, `verifier_agent`.

## Read paths

- Named queries: `q:receipts.for_intent`, `q:receipts.recent_for_mission`.
- Direct SELECT: `control_plane`, `executor_service`, `pipeline_agent`.

## Write path

- Direct DML: `control_plane`, `executor_service`, `pipeline_agent`.
- Via functions (best effort): [`api.submit_intent`](../../functions/api/submit_intent.md).

## TypeScript

insert: `Database["orchestration"]["Tables"]["operation_intent"]["Insert"]`; row: `Database["orchestration"]["Tables"]["operation_intent"]["Row"]`; update: `Database["orchestration"]["Tables"]["operation_intent"]["Update"]`

## Examples

One intent

```bash
knowledge db query receipts.for_intent --param intent_id=0192f000-0000-7000-8000-000000000001
```
Returns the intent even when no batch has sealed.

Defined in: `20260826000200_orchestration.sql`.
