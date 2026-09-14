---
id: "rel:research.report_assessment"
kind: table
schema: research
name: report_assessment
domain: research
aliases: [report assessment, post-seal verification]
tokens: [research, report_assessment, research.report_assessment, id, tenant_id, report_version_id, report_artifact_id, report_digest, verification_run_id, result_artifact_id, created_at]
summary: Post-seal result artifact bound to an exact report digest.
summary_basis: curated
rls: enabled
readers: [app_reader, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
writers: [control_plane, executor_service, service_role]
typescript: "Database[\"research\"][\"Tables\"][\"report_assessment\"][\"Row\"]"
defined_in: ["20260913020000_report_assessment_links.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research.report_assessment

table in domain `research` — Append-only post-seal assessment artifact binding to exact report bytes. Assessment authority, verdict and allowed uses remain in verification/policy artifacts, never inferred from this link..

> curated (model_assisted, unreviewed) — Read result_artifact_id and the optional canonical verification run. Presence of an assessment is not a passing verdict or permission to publish.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK |
| 2 | `tenant_id` | `uuid` | no | `util.current_tenant_id()` | unique (tenant_id, report_version_id, result_artifact_id) |
| 3 | `report_version_id` | `uuid` | no | — | unique (tenant_id, report_version_id, result_artifact_id) |
| 4 | `report_artifact_id` | `uuid` | no | — | — |
| 5 | `report_digest` | `text` | no | — | — |
| 6 | `verification_run_id` | `uuid` | yes | — | — |
| 7 | `result_artifact_id` | `uuid` | no | — | unique (tenant_id, report_version_id, result_artifact_id) |
| 8 | `created_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (id)
- unique (tenant_id, report_version_id, result_artifact_id)
- check `report_assessment_report_digest_check`: `(report_digest ~ '^[0-9a-f]{64}$'::text)`

## Relationships

Outbound: `tenant_id,report_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id`; `tenant_id,report_version_id` → [`research.report_package`](report_package.md)`.tenant_id,report_version_id`; `tenant_id,result_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id`; `tenant_id,verification_run_id` → [`evidence.verification_run`](../evidence/verification_run.md)`.tenant_id,id`.
Inbound: none.

## Indexes

`report_assessment_tenant_id_report_version_id_result_artifa_key` unique

## Triggers

- `artifact_retirement_236c598d2cc0de2304d57ab7` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `artifact_retirement_2d51cd8a965597aab5a4c227` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `report_assessment_guard` → [`research.guard_report_assessment`](../../functions/research/guard_report_assessment.md)
- `report_assessment_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `(tenant_id = util.current_tenant_id())`

## Grants

`app_reader`: SELECT; `control_plane`: INSERT, SELECT; `executor_service`: INSERT, SELECT; `pipeline_agent`: SELECT; `service_role`: INSERT, SELECT; `verifier_agent`: SELECT. None: `anon`, `authenticated`.

## Read paths

- Named queries: `q:reports.assessments`.
- Direct SELECT: `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`.

## Write path

- Direct DML: `control_plane`, `executor_service`.

## TypeScript

insert: `Database["research"]["Tables"]["report_assessment"]["Insert"]`; row: `Database["research"]["Tables"]["report_assessment"]["Row"]`; update: `Database["research"]["Tables"]["report_assessment"]["Update"]`

Defined in: `20260913020000_report_assessment_links.sql`.
