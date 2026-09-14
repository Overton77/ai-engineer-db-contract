---
id: "rel:curriculum.learning_objective"
kind: table
schema: curriculum
name: learning_objective
domain: curriculum
aliases: []
tokens: [curriculum, learning_objective, curriculum.learning_objective, id, lesson_version_id, statement, bloom_level, ordering, created_at]
summary: null
summary_basis: none
rls: enabled
readers: [executor_service, service_role]
writers: [executor_service, service_role]
typescript: "Database[\"curriculum\"][\"Tables\"][\"learning_objective\"][\"Row\"]"
defined_in: ["20260826001300_curriculum.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# curriculum.learning_objective

table in domain `curriculum`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK |
| 2 | `lesson_version_id` | `uuid` | no | — | FK → [`curriculum.lesson_version`](lesson_version.md).id |
| 3 | `statement` | `text` | no | — | — |
| 4 | `bloom_level` | `text` | yes | — | — |
| 5 | `ordering` | `integer` | no | `0` | — |
| 6 | `created_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (id)
- check `learning_objective_bloom_level_check`: `(bloom_level = ANY (ARRAY['remember'::text, 'understand'::text, 'apply'::text, 'analyze'::text, 'evaluate'::text, 'create'::text]))`

## Relationships

Outbound: `lesson_version_id` → [`curriculum.lesson_version`](lesson_version.md)`.id` on delete cascade.
Inbound: none.

## Indexes

_None._

## Triggers

_None._

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `false`

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `executor_service`.

## Write path

- Direct DML: `executor_service`.

## TypeScript

insert: `Database["curriculum"]["Tables"]["learning_objective"]["Insert"]`; row: `Database["curriculum"]["Tables"]["learning_objective"]["Row"]`; update: `Database["curriculum"]["Tables"]["learning_objective"]["Update"]`

Defined in: `20260826001300_curriculum.sql`.
