---
id: "rel:evidence.verification_adjudication_decision"
kind: table
schema: evidence
name: verification_adjudication_decision
domain: evidence
aliases: []
tokens: [evidence, verification_adjudication_decision, evidence.verification_adjudication_decision, id, tenant_id, subject_id, decision_operation_id, decision_step_id, decision_lease_token, decision_fencing_token, packet_artifact_id, packet_sha256, decision_artifact_id, decision_sha256, decision, rationale_sha256, reviewer_actor_id, reviewer_actor_kind, reviewer_service_identity, reviewer_role, reviewer_provenance, created_at]
summary: "Immutable packet-bound reviewer decision. It records human-origin or synthetic-engineering provenance but does not change policy admission, policy outcome, or human-gold status."
summary_basis: comment
rls: enabled
readers: [control_plane, executor_service, service_role]
writers: [control_plane, executor_service, service_role]
typescript: "Database[\"evidence\"][\"Tables\"][\"verification_adjudication_decision\"][\"Row\"]"
defined_in: ["20260908020000_verification_adjudication_packet_review.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_adjudication_decision

table in domain `evidence` — Immutable packet-bound reviewer decision. It records human-origin or synthetic-engineering provenance but does not change policy admission, policy outcome, or human-gold status..

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK; unique (tenant_id, id) |
| 2 | `tenant_id` | `uuid` | no | `util.default_tenant_id()` | unique (tenant_id, decision_operation_id); unique (tenant_id, subject_id, reviewer_actor_id); unique (tenant_id, id) |
| 3 | `subject_id` | `uuid` | no | — | unique (tenant_id, subject_id, reviewer_actor_id) |
| 4 | `decision_operation_id` | `uuid` | no | — | unique (tenant_id, decision_operation_id) |
| 5 | `decision_step_id` | `uuid` | no | — | — |
| 6 | `decision_lease_token` | `uuid` | no | — | — |
| 7 | `decision_fencing_token` | `bigint` | no | — | — |
| 8 | `packet_artifact_id` | `uuid` | no | — | — |
| 9 | `packet_sha256` | `text` | no | — | — |
| 10 | `decision_artifact_id` | `uuid` | no | — | — |
| 11 | `decision_sha256` | `text` | no | — | — |
| 12 | `decision` | `text` | no | — | — |
| 13 | `rationale_sha256` | `text` | no | — | — |
| 14 | `reviewer_actor_id` | `uuid` | no | — | unique (tenant_id, subject_id, reviewer_actor_id) |
| 15 | `reviewer_actor_kind` | `text` | no | — | — |
| 16 | `reviewer_service_identity` | `text` | yes | — | — |
| 17 | `reviewer_role` | `text` | no | — | — |
| 18 | `reviewer_provenance` | `text` | no | — | — |
| 19 | `created_at` | `timestamp with time zone` | no | `clock_timestamp()` | — |

## Constraints

- PK (id)
- unique (tenant_id, decision_operation_id)
- unique (tenant_id, subject_id, reviewer_actor_id)
- unique (tenant_id, id)
- check `verification_adjudication_decision_check`: `(((reviewer_provenance = 'human_origin'::text) AND (reviewer_actor_kind = 'human'::text) AND (reviewer_service_identity IS NULL)) OR ((revi…`
- check `verification_adjudication_decision_decision_check`: `(decision = ANY (ARRAY['affirm'::text, 'reject'::text, 'defer'::text]))`
- check `verification_adjudication_decision_decision_fencing_token_check`: `(decision_fencing_token > 0)`
- check `verification_adjudication_decision_decision_sha256_check`: `(decision_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_decision_packet_sha256_check`: `(packet_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_decision_rationale_sha256_check`: `(rationale_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_decision_reviewer_actor_kind_check`: `(reviewer_actor_kind = ANY (ARRAY['human'::text, 'service'::text]))`
- check `verification_adjudication_decision_reviewer_provenance_check`: `(reviewer_provenance = ANY (ARRAY['human_origin'::text, 'synthetic_engineering'::text]))`
- check `verification_adjudication_decision_reviewer_role_check`: `((reviewer_role ~ '^[A-Za-z0-9][A-Za-z0-9._:-]*$'::text) AND (char_length(reviewer_role) <= 128))`

## Relationships

Outbound: `tenant_id,decision_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,decision_operation_id` → [`knowledge_service.operation`](../knowledge_service/operation.md)`.tenant_id,id` on delete restrict; `tenant_id,packet_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,decision_step_id` → [`knowledge_service.operation_step`](../knowledge_service/operation_step.md)`.tenant_id,id` on delete restrict; `tenant_id,subject_id` → [`evidence.verification_adjudication_subject`](verification_adjudication_subject.md)`.tenant_id,id` on delete restrict.
Inbound: none.

## Indexes

4 indexes; see [details](verification_adjudication_decision.details.md).

## Triggers

4 triggers; see [details](verification_adjudication_decision.details.md).

## Row-level security

Enabled; 1 policies in [details](verification_adjudication_decision.details.md).

## Grants

`control_plane`: INSERT, SELECT; `executor_service`: INSERT, SELECT; `service_role`: INSERT, SELECT. None: `anon`, `app_reader`, `authenticated`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Exposed through: [`evidence.verification_adjudication_review_state`](verification_adjudication_review_state.md).
- Direct SELECT: `control_plane`, `executor_service`.

## Write path

- Direct DML: `control_plane`, `executor_service`.

## TypeScript

insert: `Database["evidence"]["Tables"]["verification_adjudication_decision"]["Insert"]`; row: `Database["evidence"]["Tables"]["verification_adjudication_decision"]["Row"]`; update: `Database["evidence"]["Tables"]["verification_adjudication_decision"]["Update"]`

Defined in: `20260908020000_verification_adjudication_packet_review.sql`.
