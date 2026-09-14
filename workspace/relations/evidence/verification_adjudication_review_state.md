---
id: "rel:evidence.verification_adjudication_review_state"
kind: view
schema: evidence
name: verification_adjudication_review_state
domain: evidence
aliases: []
tokens: [evidence, verification_adjudication_review_state, evidence.verification_adjudication_review_state, tenant_id, subject_id, quorum_required, human_affirmed, human_rejected, human_deferred, synthetic_recorded, quorum_reached]
summary: Read-time review counts only. Synthetic records never count toward human quorum; rejection or expiry withholds quorum. No admission or gold-label effect.
summary_basis: comment
rls: disabled
readers: [control_plane, executor_service, service_role]
writers: []
typescript: "Database[\"evidence\"][\"Views\"][\"verification_adjudication_review_state\"][\"Row\"]"
defined_in: ["20260908020000_verification_adjudication_packet_review.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_adjudication_review_state

view in domain `evidence` — Read-time review counts only. Synthetic records never count toward human quorum; rejection or expiry withholds quorum. No admission or gold-label effect..

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `tenant_id` | `uuid` | yes | — | — |
| 2 | `subject_id` | `uuid` | yes | — | — |
| 3 | `quorum_required` | `integer` | yes | — | — |
| 4 | `human_affirmed` | `bigint` | yes | — | — |
| 5 | `human_rejected` | `bigint` | yes | — | — |
| 6 | `human_deferred` | `bigint` | yes | — | — |
| 7 | `synthetic_recorded` | `bigint` | yes | — | — |
| 8 | `quorum_reached` | `boolean` | yes | — | — |

## Constraints

_None._

## Relationships

Outbound: none.
Inbound: none.

## Indexes

_None._

## Triggers

_None._

## Row-level security

Disabled.

## Grants

`control_plane`: SELECT; `executor_service`: SELECT; `service_role`: SELECT. None: `anon`, `app_reader`, `authenticated`, `pipeline_agent`, `verifier_agent`.

## Read paths

- Direct SELECT: `control_plane`, `executor_service`.

## Write path

Views are not written.

## View definition

See [details](verification_adjudication_review_state.details.md).

## TypeScript

row: `Database["evidence"]["Views"]["verification_adjudication_review_state"]["Row"]`

Defined in: `20260908020000_verification_adjudication_packet_review.sql`.
