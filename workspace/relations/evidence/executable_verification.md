---
id: "rel:evidence.executable_verification"
kind: table
schema: evidence
name: executable_verification
domain: evidence
aliases: []
tokens: [evidence, executable_verification, evidence.executable_verification, id, repository_url, commit_sha, image_digest, lockfile_hashes, commands, exit_codes, log_artifact_id, assurance_level, trace_id, executed_at]
summary: null
summary_basis: none
rls: enabled
readers: [executor_service, service_role, verifier_agent]
writers: [executor_service, service_role, verifier_agent]
typescript: "Database[\"evidence\"][\"Tables\"][\"executable_verification\"][\"Row\"]"
defined_in: ["20260826000300_evidence_core.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.executable_verification

table in domain `evidence`.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK |
| 2 | `repository_url` | `text` | yes | — | — |
| 3 | `commit_sha` | `text` | yes | — | — |
| 4 | `image_digest` | `text` | yes | — | — |
| 5 | `lockfile_hashes` | `jsonb` | no | `'{}'::jsonb` | — |
| 6 | `commands` | `jsonb` | no | `'[]'::jsonb` | — |
| 7 | `exit_codes` | `jsonb` | no | `'[]'::jsonb` | — |
| 8 | `log_artifact_id` | `uuid` | yes | — | FK → [`orchestration.artifact`](../orchestration/artifact.md).id |
| 9 | `assurance_level` | `text` | no | — | — |
| 10 | `trace_id` | `text` | yes | — | — |
| 11 | `executed_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (id)

## Relationships

Outbound: `log_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.id`.
Inbound: none.

## Indexes

_None._

## Triggers

- `artifact_retirement_3acab0a63b9f5919d96f8859` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md)
- `executable_verification_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `false`

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE; `verifier_agent`: INSERT, SELECT. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`.

## Read paths

- Direct SELECT: `executor_service`, `verifier_agent`.

## Write path

- Direct DML: `executor_service`, `verifier_agent`.

## TypeScript

insert: `Database["evidence"]["Tables"]["executable_verification"]["Insert"]`; row: `Database["evidence"]["Tables"]["executable_verification"]["Row"]`; update: `Database["evidence"]["Tables"]["executable_verification"]["Update"]`

Defined in: `20260826000300_evidence_core.sql`.
