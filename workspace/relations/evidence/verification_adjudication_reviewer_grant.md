---
id: "rel:evidence.verification_adjudication_reviewer_grant"
kind: table
schema: evidence
name: verification_adjudication_reviewer_grant
domain: evidence
aliases: []
tokens: [evidence, verification_adjudication_reviewer_grant, evidence.verification_adjudication_reviewer_grant, id, tenant_id, subject_id, reviewer_actor_id, reviewer_role, expires_at, created_at]
summary: Reserved immutable explicit human reviewer grant. This migration grants no writer and does not authorize synthetic engineering review or human policy authority.
summary_basis: comment
rls: enabled
readers: [control_plane, executor_service, service_role]
writers: []
typescript: "Database[\"evidence\"][\"Tables\"][\"verification_adjudication_reviewer_grant\"][\"Row\"]"
defined_in: ["20260908020000_verification_adjudication_packet_review.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_adjudication_reviewer_grant

table in domain `evidence` — Reserved immutable explicit human reviewer grant. This migration grants no writer and does not authorize synthetic engineering review or human policy authority..

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK; unique (tenant_id, id) |
| 2 | `tenant_id` | `uuid` | no | `util.default_tenant_id()` | unique (tenant_id, subject_id, reviewer_actor_id, reviewer_role); unique (tenant_id, id) |
| 3 | `subject_id` | `uuid` | no | — | unique (tenant_id, subject_id, reviewer_actor_id, reviewer_role) |
| 4 | `reviewer_actor_id` | `uuid` | no | — | unique (tenant_id, subject_id, reviewer_actor_id, reviewer_role) |
| 5 | `reviewer_role` | `text` | no | — | unique (tenant_id, subject_id, reviewer_actor_id, reviewer_role) |
| 6 | `expires_at` | `timestamp with time zone` | yes | — | — |
| 7 | `created_at` | `timestamp with time zone` | no | `clock_timestamp()` | — |

## Constraints

- PK (id)
- unique (tenant_id, subject_id, reviewer_actor_id, reviewer_role)
- unique (tenant_id, id)
- check `verification_adjudication_reviewer_grant_check`: `((expires_at IS NULL) OR (expires_at > created_at))`
- check `verification_adjudication_reviewer_grant_reviewer_role_check`: `((reviewer_role ~ '^[A-Za-z0-9][A-Za-z0-9._:-]*$'::text) AND (char_length(reviewer_role) <= 128))`

## Relationships

Outbound: `tenant_id,subject_id` → [`evidence.verification_adjudication_subject`](verification_adjudication_subject.md)`.tenant_id,id` on delete restrict.
Inbound: none.

## Indexes

`verification_adjudication_rev_tenant_id_subject_id_reviewer_key` unique; `verification_adjudication_reviewer_grant_tenant_id_id_key` unique

## Triggers

- `evidence_verification_adjudication_reviewer_grant_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)

## Row-level security

Enabled.
- `tenant_grant_read` (SELECT) for `control_plane`, `executor_service`: `(tenant_id = util.current_tenant_id())`

## Grants

`control_plane`: SELECT; `executor_service`: SELECT; `service_role`: SELECT. None: `anon`, `app_reader`, `authenticated`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `control_plane`, `executor_service`.

## Write path

- No direct DML for any agent role.
- No write path for agents; rows are seeded by migrations or platform tooling.

## TypeScript

insert: `Database["evidence"]["Tables"]["verification_adjudication_reviewer_grant"]["Insert"]`; row: `Database["evidence"]["Tables"]["verification_adjudication_reviewer_grant"]["Row"]`; update: `Database["evidence"]["Tables"]["verification_adjudication_reviewer_grant"]["Update"]`

Defined in: `20260908020000_verification_adjudication_packet_review.sql`.
