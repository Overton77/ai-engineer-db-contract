---
id: "rel:evidence.verification_run"
kind: table
schema: evidence
name: verification_run
domain: evidence
aliases: [sealed run]
tokens: [evidence, verification_run, evidence.verification_run, id, work_item_id, verifier_attempt_id, policy_version, started_at, ended_at, tenant_id, producer_attempt_id, mission_id, operation_id, contract_version, bundle_artifact_id, deterministic_result_artifact_id, policy_artifact_id, policy_artifact_sha256, run_manifest_artifact_id, manifest_sha256, status]
summary: Sealed verification-run ledger that ingestion cites; unsealed runs are EVIDENCE_NOT_ELIGIBLE.
summary_basis: curated
rls: enabled
readers: [executor_service, service_role, verifier_agent]
writers: [executor_service, service_role, verifier_agent]
typescript: "Database[\"evidence\"][\"Tables\"][\"verification_run\"][\"Row\"]"
defined_in: ["20260826000300_evidence_core.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_run

table in domain `evidence` — Artifact-backed verification.v1 run. Producer/verifier deployments are distinct and the run permits one terminal transition..

> curated (model_assisted, unreviewed) — Sealed verification-run ledger that ingestion cites; unsealed runs are EVIDENCE_NOT_ELIGIBLE.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK; unique (tenant_id, id) |
| 2 | `work_item_id` | `uuid` | yes | — | FK → [`orchestration.work_item`](../orchestration/work_item.md).id |
| 3 | `verifier_attempt_id` | `uuid` | no | — | FK → [`orchestration.attempt`](../orchestration/attempt.md).id |
| 4 | `policy_version` | `text` | no | — | — |
| 5 | `started_at` | `timestamp with time zone` | no | `now()` | — |
| 6 | `ended_at` | `timestamp with time zone` | yes | — | — |
| 7 | `tenant_id` | `uuid` | yes | — | unique (tenant_id, id) |
| 8 | `producer_attempt_id` | `uuid` | yes | — | — |
| 9 | `mission_id` | `uuid` | yes | — | — |
| 10 | `operation_id` | `uuid` | yes | — | — |
| 11 | `contract_version` | `text` | yes | — | — |
| 12 | `bundle_artifact_id` | `uuid` | yes | — | — |
| 13 | `deterministic_result_artifact_id` | `uuid` | yes | — | — |
| 14 | `policy_artifact_id` | `uuid` | yes | — | — |
| 15 | `policy_artifact_sha256` | `text` | yes | — | — |
| 16 | `run_manifest_artifact_id` | `uuid` | yes | — | — |
| 17 | `manifest_sha256` | `text` | yes | — | SHA-256 of the stored run-manifest artifact bytes. The inner signable manifest and detached seal payload use separate contract digests.; _curated:_ Digest of the run manifest artifact. |
| 18 | `status` | `text` | yes | — | _curated:_ Sealed vs in-flight; ingestion requires a sealed run. |

## Constraints

- PK (id)
- unique (tenant_id, id)
- check `verification_run_attempts_distinct_ck`: `((contract_version IS NULL) OR (producer_attempt_id <> verifier_attempt_id))`
- check `verification_run_contract_version_check`: `((contract_version IS NULL) OR (contract_version = 'verification.v1'::text))`
- check `verification_run_manifest_sha256_check`: `((manifest_sha256 IS NULL) OR (manifest_sha256 ~ '^[0-9a-f]{64}$'::text))`
- check `verification_run_policy_artifact_sha256_check`: `((policy_artifact_sha256 IS NULL) OR (policy_artifact_sha256 ~ '^[0-9a-f]{64}$'::text))`
- check `verification_run_status_check`: `((status IS NULL) OR (status = ANY (ARRAY['running'::text, 'succeeded'::text, 'failed'::text, 'review'::text, 'abstained'::text, 'cancelled…`
- check `verification_run_terminal_ck`: `((contract_version IS NULL) OR ((tenant_id IS NOT NULL) AND (producer_attempt_id IS NOT NULL) AND (bundle_artifact_id IS NOT NULL) AND (det…`

## Relationships

11 outbound and 10 inbound foreign keys; full list in [details](verification_run.details.md).

## Indexes

2 indexes; see [details](verification_run.details.md).

## Triggers

6 triggers; see [details](verification_run.details.md).

## Row-level security

Enabled; 1 policies in [details](verification_run.details.md).

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE; `verifier_agent`: INSERT, SELECT. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`.

## Read paths

- Direct SELECT: `executor_service`, `verifier_agent`.

## Write path

- Direct DML: `executor_service`, `verifier_agent`.

## TypeScript

insert: `Database["evidence"]["Tables"]["verification_run"]["Insert"]`; row: `Database["evidence"]["Tables"]["verification_run"]["Row"]`; update: `Database["evidence"]["Tables"]["verification_run"]["Update"]`

## Examples

Claims already attached to an entity

```bash
knowledge db query evidence.claims_for_entity --param entity_id=0192b000-0000-7000-8000-000000000001 --param limit=100
```
Materialize claims from a sealed run before admitting support.

Defined in: `20260826000300_evidence_core.sql`.
