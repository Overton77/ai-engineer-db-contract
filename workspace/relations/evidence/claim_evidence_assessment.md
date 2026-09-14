---
id: "rel:evidence.claim_evidence_assessment"
kind: table
schema: evidence
name: claim_evidence_assessment
domain: evidence
aliases: []
tokens: [evidence, claim_evidence_assessment, evidence.claim_evidence_assessment, id, claim_evidence_link_id, run_id, verdict, authority_assessment, rationale, replay_signature_match, created_at, tenant_id, verification_contract_version, properties, public_rationale]
summary: "Append-only, run-scoped verifier assessment of one immutable claim/evidence link."
summary_basis: comment
rls: enabled
readers: [app_reader, executor_service, pipeline_agent, service_role, verifier_agent]
writers: [executor_service, pipeline_agent, service_role, verifier_agent]
typescript: "Database[\"evidence\"][\"Tables\"][\"claim_evidence_assessment\"][\"Row\"]"
defined_in: ["20260829194954_normalize_append_only_claim_evidence_assessments.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.claim_evidence_assessment

table in domain `evidence` — Append-only, run-scoped verifier assessment of one immutable claim/evidence link..

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK; unique (tenant_id, id) |
| 2 | `claim_evidence_link_id` | `uuid` | no | — | unique (claim_evidence_link_id, run_id); FK → [`evidence.claim_evidence_link`](claim_evidence_link.md).id |
| 3 | `run_id` | `uuid` | no | — | unique (claim_evidence_link_id, run_id); FK → [`evidence.verification_run`](verification_run.md).id |
| 4 | `verdict` | `evidence.support_verdict` | no | — | — |
| 5 | `authority_assessment` | `jsonb` | no | — | — |
| 6 | `rationale` | `text` | yes | — | — |
| 7 | `replay_signature_match` | `boolean` | no | — | — |
| 8 | `created_at` | `timestamp with time zone` | no | `now()` | — |
| 9 | `tenant_id` | `uuid` | yes | — | unique (tenant_id, id) |
| 10 | `verification_contract_version` | `text` | yes | — | — |
| 11 | `properties` | `jsonb` | yes | — | — |
| 12 | `public_rationale` | `text` | yes | — | — |

## Constraints

- PK (id)
- unique (claim_evidence_link_id, run_id)
- unique (tenant_id, id)
- check `claim_evidence_assessment_v1_fields_ck`: `((verification_contract_version IS NULL) OR ((tenant_id IS NOT NULL) AND (properties IS NOT NULL) AND (public_rationale IS NOT NULL)))`
- check `claim_evidence_assessment_verification_contract_version_check`: `((verification_contract_version IS NULL) OR (verification_contract_version = 'verification.v1'::text))`
- check `claim_evidence_assessment_verification_contract_version_ck`: `((verification_contract_version IS NULL) OR (verification_contract_version = 'verification.v1'::text))`

## Relationships

Outbound: `claim_evidence_link_id` → [`evidence.claim_evidence_link`](claim_evidence_link.md)`.id` (+tenant) on delete cascade; `run_id` → [`evidence.verification_run`](verification_run.md)`.id` (+tenant) on delete cascade.
Inbound: none.

## Indexes

`claim_evidence_assessment_claim_evidence_link_id_run_id_key` unique; `claim_evidence_assessment_run_idx`; `claim_evidence_assessment_tenant_id_uq` unique

## Triggers

- `claim_evidence_assessment_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)
- `claim_evidence_assessment_independence` → [`evidence.enforce_assessment_producer_not_verifier`](../../functions/evidence/enforce_assessment_producer_not_verifier.md)

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `(tenant_id = util.current_tenant_id())`

## Grants

`app_reader`: SELECT; `executor_service`: INSERT, SELECT; `pipeline_agent`: INSERT, SELECT; `service_role`: INSERT, SELECT; `verifier_agent`: INSERT, SELECT. None: `anon`, `authenticated`, `control_plane`.

## Read paths

- Direct SELECT: `app_reader`, `executor_service`, `pipeline_agent`, `verifier_agent`.

## Write path

- Direct DML: `executor_service`, `pipeline_agent`, `verifier_agent`.

## TypeScript

insert: `Database["evidence"]["Tables"]["claim_evidence_assessment"]["Insert"]`; row: `Database["evidence"]["Tables"]["claim_evidence_assessment"]["Row"]`; update: `Database["evidence"]["Tables"]["claim_evidence_assessment"]["Update"]`

Defined in: `20260829194954_normalize_append_only_claim_evidence_assessments.sql`.
