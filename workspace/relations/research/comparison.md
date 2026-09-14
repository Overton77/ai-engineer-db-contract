---
id: "rel:research.comparison"
kind: table
schema: research
name: comparison
domain: research
aliases: []
tokens: [research, comparison, research.comparison, id, mission_id, title, entity_kind, entity_ids, dimensions, verdicts, created_at]
summary: null
summary_basis: none
rls: enabled
readers: [control_plane, executor_service, service_role]
writers: [executor_service, service_role]
typescript: "Database[\"research\"][\"Tables\"][\"comparison\"][\"Row\"]"
defined_in: ["20260826000900_research.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research.comparison

table in domain `research`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK |
| 2 | `mission_id` | `uuid` | no | — | FK → [`orchestration.mission`](../orchestration/mission.md).id |
| 3 | `title` | `text` | no | — | — |
| 4 | `entity_kind` | `text` | no | — | — |
| 5 | `entity_ids` | `uuid[]` | no | `'{}'::uuid[]` | — |
| 6 | `dimensions` | `jsonb` | no | `'[]'::jsonb` | — |
| 7 | `verdicts` | `jsonb` | no | `'{}'::jsonb` | — |
| 8 | `created_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (id)

## Relationships

Outbound: `mission_id` → [`orchestration.mission`](../orchestration/mission.md)`.id` on delete cascade.
Inbound: none.

## Indexes

_None._

## Triggers

_None._

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

insert: `Database["research"]["Tables"]["comparison"]["Insert"]`; row: `Database["research"]["Tables"]["comparison"]["Row"]`; update: `Database["research"]["Tables"]["comparison"]["Update"]`

Defined in: `20260826000900_research.sql`.
