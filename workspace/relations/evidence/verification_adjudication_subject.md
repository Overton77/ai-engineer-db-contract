---
id: "rel:evidence.verification_adjudication_subject"
kind: table
schema: evidence
name: verification_adjudication_subject
domain: evidence
aliases: []
tokens: [evidence, verification_adjudication_subject, evidence.verification_adjudication_subject, id, tenant_id, request_operation_id, request_step_id, request_lease_token, request_fencing_token, request_operation_sha256, request_step_input_sha256, request_payload_sha256, target_kind, target_id, target_object_sha256, reason, requester_actor_id, requester_actor_kind, requester_note, eligible_reviewer_roles, quorum_required, verification_run_id, run_kind, run_manifest_artifact_id, run_manifest_sha256, run_manifest_payload_sha256, bundle_artifact_id, bundle_sha256, deterministic_result_artifact_id, deterministic_result_sha256, policy_artifact_id, policy_artifact_sha256, recorded_policy_inputs_artifact_id, recorded_policy_inputs_sha256, policy_decision_artifact_id, policy_decision_sha256, original_policy_outcome, audit_payload_sha256, report_gate_artifact_id, report_gate_sha256, packet_artifact_id, packet_sha256, expires_at, created_at]
summary: "Immutable tenant-scoped requestAdjudication subject and server-composed packet binding. It establishes no human decision, authority grant, policy override, admission outcome, or human-gold status."
summary_basis: comment
rls: enabled
readers: [control_plane, executor_service, service_role]
writers: [control_plane, executor_service, service_role]
typescript: "Database[\"evidence\"][\"Tables\"][\"verification_adjudication_subject\"][\"Row\"]"
defined_in: ["20260907012000_verification_adjudication_subject_ledger.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_adjudication_subject

table in domain `evidence` — Immutable tenant-scoped requestAdjudication subject and server-composed packet binding. It establishes no human decision, authority grant, policy override, admission outcome, or human-gold status..

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK; unique (tenant_id, id) |
| 2 | `tenant_id` | `uuid` | no | `util.default_tenant_id()` | unique (tenant_id, request_operation_id); unique (tenant_id, id) |
| 3 | `request_operation_id` | `uuid` | no | — | unique (tenant_id, request_operation_id) |
| 4 | `request_step_id` | `uuid` | no | — | — |
| 5 | `request_lease_token` | `uuid` | no | — | — |
| 6 | `request_fencing_token` | `bigint` | no | — | — |
| 7 | `request_operation_sha256` | `text` | no | — | — |
| 8 | `request_step_input_sha256` | `text` | no | — | — |
| 9 | `request_payload_sha256` | `text` | no | — | — |
| 10 | `target_kind` | `text` | no | — | — |
| 11 | `target_id` | `text` | no | — | — |
| 12 | `target_object_sha256` | `text` | no | — | — |
| 13 | `reason` | `text` | no | — | — |
| 14 | `requester_actor_id` | `uuid` | no | — | — |
| 15 | `requester_actor_kind` | `text` | no | — | — |
| 16 | `requester_note` | `text` | yes | — | — |
| 17 | `eligible_reviewer_roles` | `text[]` | no | — | — |
| 18 | `quorum_required` | `integer` | no | `1` | — |
| 19 | `verification_run_id` | `uuid` | no | — | — |
| 20 | `run_kind` | `text` | no | — | — |
| 21 | `run_manifest_artifact_id` | `uuid` | no | — | — |
| 22 | `run_manifest_sha256` | `text` | no | — | — |
| 23 | `run_manifest_payload_sha256` | `text` | no | — | — |
| 24 | `bundle_artifact_id` | `uuid` | no | — | — |
| 25 | `bundle_sha256` | `text` | no | — | — |
| 26 | `deterministic_result_artifact_id` | `uuid` | no | — | — |
| 27 | `deterministic_result_sha256` | `text` | no | — | — |
| 28 | `policy_artifact_id` | `uuid` | no | — | — |
| 29 | `policy_artifact_sha256` | `text` | no | — | — |
| 30 | `recorded_policy_inputs_artifact_id` | `uuid` | no | — | — |
| 31 | `recorded_policy_inputs_sha256` | `text` | no | — | — |
| 32 | `policy_decision_artifact_id` | `uuid` | no | — | — |
| 33 | `policy_decision_sha256` | `text` | no | — | — |
| 34 | `original_policy_outcome` | `text` | no | — | — |
| 35 | `audit_payload_sha256` | `text` | no | — | — |
| 36 | `report_gate_artifact_id` | `uuid` | yes | — | — |
| 37 | `report_gate_sha256` | `text` | yes | — | — |
| 38 | `packet_artifact_id` | `uuid` | no | — | — |
| 39 | `packet_sha256` | `text` | no | — | — |
| 40 | `expires_at` | `timestamp with time zone` | yes | — | — |
| 41 | `created_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (id)
- unique (tenant_id, request_operation_id)
- unique (tenant_id, id)
- 26 check constraints; see [details](verification_adjudication_subject.details.md)

## Relationships

11 outbound and 2 inbound foreign keys; full list in [details](verification_adjudication_subject.details.md).

## Indexes

3 indexes; see [details](verification_adjudication_subject.details.md).

## Triggers

10 triggers; see [details](verification_adjudication_subject.details.md).

## Row-level security

Enabled; 1 policies in [details](verification_adjudication_subject.details.md).

## Grants

`control_plane`: INSERT, SELECT; `executor_service`: INSERT, SELECT; `service_role`: INSERT, SELECT. None: `anon`, `app_reader`, `authenticated`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Exposed through: [`evidence.verification_adjudication_review_state`](verification_adjudication_review_state.md).
- Direct SELECT: `control_plane`, `executor_service`.

## Write path

- Direct DML: `control_plane`, `executor_service`.

## TypeScript

insert: `Database["evidence"]["Tables"]["verification_adjudication_subject"]["Insert"]`; row: `Database["evidence"]["Tables"]["verification_adjudication_subject"]["Row"]`; update: `Database["evidence"]["Tables"]["verification_adjudication_subject"]["Update"]`

Defined in: `20260907012000_verification_adjudication_subject_ledger.sql`.
