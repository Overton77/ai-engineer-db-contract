---
id: "rel:evidence.verification_case_evidence"
kind: table
schema: evidence
name: verification_case_evidence
domain: evidence
aliases: []
tokens: [evidence, verification_case_evidence, evidence.verification_case_evidence, id, tenant_id, case_run_id, evidence_key, ordinal, artifact_id, artifact_sha256, created_at]
summary: "Immutable artifact-only evidence reference for a verification case. Finding, judgment, locator, and evaluation aliases are intentionally absent."
summary_basis: comment
rls: enabled
readers: [app_reader, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
writers: [control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
typescript: "Database[\"evidence\"][\"Tables\"][\"verification_case_evidence\"][\"Row\"]"
defined_in: ["20260906023000_verification_case_evidence_reads.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_case_evidence

table in domain `evidence` — Immutable artifact-only evidence reference for a verification case. Finding, judgment, locator, and evaluation aliases are intentionally absent..

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK; unique (tenant_id, id) |
| 2 | `tenant_id` | `uuid` | no | `util.default_tenant_id()` | unique (tenant_id, case_run_id, evidence_key); unique (tenant_id, case_run_id, ordinal); unique (tenant_id, id) |
| 3 | `case_run_id` | `uuid` | no | — | unique (tenant_id, case_run_id, evidence_key); unique (tenant_id, case_run_id, ordinal) |
| 4 | `evidence_key` | `text` | no | — | unique (tenant_id, case_run_id, evidence_key) |
| 5 | `ordinal` | `integer` | no | — | unique (tenant_id, case_run_id, ordinal) |
| 6 | `artifact_id` | `uuid` | no | — | — |
| 7 | `artifact_sha256` | `text` | no | — | — |
| 8 | `created_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (id)
- unique (tenant_id, case_run_id, evidence_key)
- unique (tenant_id, case_run_id, ordinal)
- unique (tenant_id, id)
- check `verification_case_evidence_artifact_sha256_check`: `(artifact_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_case_evidence_evidence_key_check`: `(((length(evidence_key) >= 1) AND (length(evidence_key) <= 255)) AND (btrim(evidence_key) <> ''::text))`
- check `verification_case_evidence_ordinal_check`: `((ordinal >= 0) AND (ordinal <= 255))`

## Relationships

Outbound: `tenant_id,artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,case_run_id` → [`evidence.verification_case_run`](verification_case_run.md)`.tenant_id,id` on delete restrict.
Inbound: none.

## Indexes

`verification_case_evidence_tenant_id_case_run_id_evidence_k_key` unique; `verification_case_evidence_tenant_id_case_run_id_ordinal_key` unique; `verification_case_evidence_tenant_id_id_key` unique

## Triggers

- `artifact_retirement_c64f55920ea68638beecff0b` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `verification_case_evidence_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)
- `verification_case_evidence_validate` → [`evidence.validate_verification_case_evidence`](../../functions/evidence/validate_verification_case_evidence.md)

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `(tenant_id = util.current_tenant_id())`

## Grants

`app_reader`: SELECT; `control_plane`: INSERT, SELECT; `executor_service`: INSERT, SELECT; `pipeline_agent`: INSERT, SELECT; `service_role`: INSERT, SELECT; `verifier_agent`: INSERT, SELECT. None: `anon`, `authenticated`.

## Read paths

- Direct SELECT: `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`.

## Write path

- Direct DML: `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`.

## TypeScript

insert: `Database["evidence"]["Tables"]["verification_case_evidence"]["Insert"]`; row: `Database["evidence"]["Tables"]["verification_case_evidence"]["Row"]`; update: `Database["evidence"]["Tables"]["verification_case_evidence"]["Update"]`

Defined in: `20260906023000_verification_case_evidence_reads.sql`.
