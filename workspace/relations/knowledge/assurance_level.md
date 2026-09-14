---
id: "rel:knowledge.assurance_level"
kind: table
schema: knowledge
name: assurance_level
domain: knowledge-records
aliases: []
tokens: [knowledge, assurance_level, knowledge.assurance_level, code, rank, description]
summary: null
summary_basis: none
rls: enabled
readers: [executor_service, pipeline_agent, service_role, verifier_agent]
writers: [executor_service, service_role]
typescript: "Database[\"knowledge\"][\"Tables\"][\"assurance_level\"][\"Row\"]"
defined_in: ["20260826000600_knowledge.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge.assurance_level

table in domain `knowledge-records`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `code` | `text` | no | — | PK |
| 2 | `rank` | `integer` | no | — | unique (rank) |
| 3 | `description` | `text` | no | — | — |

## Constraints

- PK (code)
- unique (rank)

## Relationships

Outbound: none.
Inbound: [`knowledge.record`](record.md).assurance_level.

## Indexes

`assurance_level_rank_key` unique

## Triggers

_None._

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `false`

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `pipeline_agent`: SELECT; `service_role`: INSERT, SELECT, UPDATE; `verifier_agent`: SELECT. None: `anon`, `app_reader`, `authenticated`, `control_plane`.

## Read paths

- Direct SELECT: `executor_service`, `pipeline_agent`, `verifier_agent`.

## Write path

- Direct DML: `executor_service`.

## TypeScript

insert: `Database["knowledge"]["Tables"]["assurance_level"]["Insert"]`; row: `Database["knowledge"]["Tables"]["assurance_level"]["Row"]`; update: `Database["knowledge"]["Tables"]["assurance_level"]["Update"]`

Defined in: `20260826000600_knowledge.sql`.
