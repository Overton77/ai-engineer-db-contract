---
id: "rel:research.report_package_seal"
kind: table
schema: research
name: report_package_seal
domain: research
aliases: [structural seal, report registration]
tokens: [research, report_package_seal, research.report_package_seal, tenant_id, report_version_id, manifest_artifact_id, sealed_at]
summary: Immutable structural registration seal for available package artifacts.
summary_basis: curated
rls: enabled
readers: [app_reader, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
writers: [control_plane, executor_service, service_role]
typescript: "Database[\"research\"][\"Tables\"][\"report_package_seal\"][\"Row\"]"
defined_in: ["20260913010000_research_report_packages.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research.report_package_seal

table in domain `research` — Immutable registration seal, not verification or policy admission. Official publication must independently verify final bytes and evidence..

> curated (model_assisted, unreviewed) — Sealing freezes projections and checks structure and references. It is not semantic verification, publication admission or proof that all factual assertions were detected.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `tenant_id` | `uuid` | no | `util.current_tenant_id()` | — |
| 2 | `report_version_id` | `uuid` | no | — | PK |
| 3 | `manifest_artifact_id` | `uuid` | no | — | — |
| 4 | `sealed_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (report_version_id)

## Relationships

Outbound: `tenant_id,manifest_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id`; `tenant_id,report_version_id` → [`research.report_package`](report_package.md)`.tenant_id,report_version_id`.
Inbound: none.

## Indexes

_None._

## Triggers

- `artifact_retirement_738d15499188f98bfbe37e93` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `report_package_seal_guard` → [`research.guard_report_seal`](../../functions/research/guard_report_seal.md)
- `report_row_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `(tenant_id = util.current_tenant_id())`

## Grants

`app_reader`: SELECT; `control_plane`: INSERT, SELECT; `executor_service`: INSERT, SELECT; `pipeline_agent`: SELECT; `service_role`: INSERT, SELECT; `verifier_agent`: SELECT. None: `anon`, `authenticated`.

## Read paths

- Named queries: `q:reports.versions`.
- Direct SELECT: `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`.

## Write path

- Direct DML: `control_plane`, `executor_service`.

## TypeScript

insert: `Database["research"]["Tables"]["report_package_seal"]["Insert"]`; row: `Database["research"]["Tables"]["report_package_seal"]["Row"]`; update: `Database["research"]["Tables"]["report_package_seal"]["Update"]`

Defined in: `20260913010000_research_report_packages.sql`.
