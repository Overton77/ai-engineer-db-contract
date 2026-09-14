---
id: "rel:research.bundle_artifact"
kind: table
schema: research
name: bundle_artifact
domain: research
aliases: []
tokens: [research, bundle_artifact, research.bundle_artifact, bundle_id, artifact_id, role]
summary: null
summary_basis: none
rls: enabled
readers: [control_plane, executor_service, service_role]
writers: [executor_service, service_role]
typescript: "Database[\"research\"][\"Tables\"][\"bundle_artifact\"][\"Row\"]"
defined_in: ["20260826000900_research.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research.bundle_artifact

table in domain `research`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `bundle_id` | `uuid` | no | — | PK; FK → [`research.research_bundle`](research_bundle.md).id |
| 2 | `artifact_id` | `uuid` | no | — | PK; FK → [`orchestration.artifact`](../orchestration/artifact.md).id |
| 3 | `role` | `text` | no | — | PK |

## Constraints

- PK (bundle_id, artifact_id, role)

## Relationships

Outbound: `artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.id`; `bundle_id` → [`research.research_bundle`](research_bundle.md)`.id` on delete cascade.
Inbound: none.

## Indexes

_None._

## Triggers

- `artifact_retirement_57f1710e689fd29a919cbb18` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `false`

## Grants

`control_plane`: SELECT; `executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE. None: `anon`, `app_reader`, `authenticated`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `control_plane`, `executor_service`.

## Write path

- Direct DML: `executor_service`.

## TypeScript

insert: `Database["research"]["Tables"]["bundle_artifact"]["Insert"]`; row: `Database["research"]["Tables"]["bundle_artifact"]["Row"]`; update: `Database["research"]["Tables"]["bundle_artifact"]["Update"]`

Defined in: `20260826000900_research.sql`.
