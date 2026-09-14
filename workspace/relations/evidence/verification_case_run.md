---
id: "rel:evidence.verification_case_run"
kind: table
schema: evidence
name: verification_case_run
domain: evidence
aliases: []
tokens: [evidence, verification_case_run, evidence.verification_case_run, id, tenant_id, verification_run_id, case_key, input_artifact_id, input_sha256, result_artifact_id, result_sha256, created_at]
summary: Immutable artifact-backed verification case result. It does not alias evaluation score/output identities.
summary_basis: comment
rls: enabled
readers: [app_reader, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
writers: [control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
typescript: "Database[\"evidence\"][\"Tables\"][\"verification_case_run\"][\"Row\"]"
defined_in: ["20260906023000_verification_case_evidence_reads.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_case_run

table in domain `evidence` — Immutable artifact-backed verification case result. It does not alias evaluation score/output identities..

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK; unique (tenant_id, id) |
| 2 | `tenant_id` | `uuid` | no | `util.default_tenant_id()` | unique (tenant_id, id); unique (tenant_id, verification_run_id, case_key) |
| 3 | `verification_run_id` | `uuid` | no | — | unique (tenant_id, verification_run_id, case_key) |
| 4 | `case_key` | `text` | no | — | unique (tenant_id, verification_run_id, case_key) |
| 5 | `input_artifact_id` | `uuid` | no | — | — |
| 6 | `input_sha256` | `text` | no | — | — |
| 7 | `result_artifact_id` | `uuid` | no | — | — |
| 8 | `result_sha256` | `text` | no | — | — |
| 9 | `created_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (id)
- unique (tenant_id, id)
- unique (tenant_id, verification_run_id, case_key)
- check `verification_case_run_case_key_check`: `(((length(case_key) >= 1) AND (length(case_key) <= 255)) AND (btrim(case_key) <> ''::text))`
- check `verification_case_run_input_sha256_check`: `(input_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_case_run_result_sha256_check`: `(result_sha256 ~ '^[0-9a-f]{64}$'::text)`

## Relationships

Outbound: `tenant_id,input_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,result_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,verification_run_id` → [`evidence.verification_run`](verification_run.md)`.tenant_id,id` on delete restrict.
Inbound: [`evidence.verification_case_evidence`](verification_case_evidence.md).case_run_id.

## Indexes

`verification_case_run_tenant_id_id_key` unique; `verification_case_run_tenant_id_verification_run_id_case_ke_key` unique

## Triggers

- `artifact_retirement_bf1f8ca62f3ac56ee0a57bb7` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `artifact_retirement_efc97475e8e67e8dc2066b98` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `verification_case_run_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)
- `verification_case_run_validate` → [`evidence.validate_verification_case_run`](../../functions/evidence/validate_verification_case_run.md)

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

insert: `Database["evidence"]["Tables"]["verification_case_run"]["Insert"]`; row: `Database["evidence"]["Tables"]["verification_case_run"]["Row"]`; update: `Database["evidence"]["Tables"]["verification_case_run"]["Update"]`

Defined in: `20260906023000_verification_case_evidence_reads.sql`.
