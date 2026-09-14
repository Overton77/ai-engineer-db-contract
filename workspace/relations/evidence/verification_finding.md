---
id: "rel:evidence.verification_finding"
kind: table
schema: evidence
name: verification_finding
domain: evidence
aliases: []
tokens: [evidence, verification_finding, evidence.verification_finding, id, run_id, claim_id, verdict, rationale, deterministic, replay_signature_match, created_at, tenant_id, verification_contract_version, judge_kind, grader_version, output_schema_sha256, blinded_input_artifact_sha256, properties, supporting_fragment_ids, contradicting_fragment_ids, unsupported_facets, public_rationale, calibrated_probability, latency_ms, token_usage, cost_micros, retries, provider_response_id, failure_category, judgment_id, evidence_id, observed_at]
summary: Append-only verification judgment observations. Multiple judge kinds may assess one claim in a run.
summary_basis: comment
rls: enabled
readers: [executor_service, service_role, verifier_agent]
writers: [executor_service, service_role, verifier_agent]
typescript: "Database[\"evidence\"][\"Tables\"][\"verification_finding\"][\"Row\"]"
defined_in: ["20260826000300_evidence_core.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_finding

table in domain `evidence` — Append-only verification judgment observations. Multiple judge kinds may assess one claim in a run..

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK; unique (tenant_id, id) |
| 2 | `run_id` | `uuid` | no | — | unique (tenant_id, run_id, judgment_id); FK → [`evidence.verification_run`](verification_run.md).id |
| 3 | `claim_id` | `uuid` | no | — | FK → [`evidence.claim`](claim.md).id |
| 4 | `verdict` | `evidence.support_verdict` | no | — | — |
| 5 | `rationale` | `text` | yes | — | — |
| 6 | `deterministic` | `boolean` | no | `false` | — |
| 7 | `replay_signature_match` | `boolean` | yes | — | Nullable observation: true/false only when a replay receipt checked the signature; null means replay was not performed or is unknown. |
| 8 | `created_at` | `timestamp with time zone` | no | `now()` | — |
| 9 | `tenant_id` | `uuid` | yes | — | unique (tenant_id, id); unique (tenant_id, run_id, judgment_id) |
| 10 | `verification_contract_version` | `text` | yes | — | — |
| 11 | `judge_kind` | `text` | yes | — | — |
| 12 | `grader_version` | `text` | yes | — | — |
| 13 | `output_schema_sha256` | `text` | yes | — | — |
| 14 | `blinded_input_artifact_sha256` | `text` | yes | — | — |
| 15 | `properties` | `jsonb` | yes | — | — |
| 16 | `supporting_fragment_ids` | `text[]` | yes | — | — |
| 17 | `contradicting_fragment_ids` | `text[]` | yes | — | — |
| 18 | `unsupported_facets` | `text[]` | yes | — | — |
| 19 | `public_rationale` | `text` | yes | — | — |
| 20 | `calibrated_probability` | `numeric(6,5)` | yes | — | — |
| 21 | `latency_ms` | `bigint` | yes | — | — |
| 22 | `token_usage` | `bigint` | yes | — | — |
| 23 | `cost_micros` | `bigint` | yes | — | — |
| 24 | `retries` | `integer` | yes | — | — |
| 25 | `provider_response_id` | `text` | yes | — | — |
| 26 | `failure_category` | `text` | yes | — | — |
| 27 | `judgment_id` | `text` | yes | — | unique (tenant_id, run_id, judgment_id) |
| 28 | `evidence_id` | `text` | yes | — | — |
| 29 | `observed_at` | `timestamp with time zone` | yes | — | — |

## Constraints

- PK (id)
- unique (tenant_id, id)
- unique (tenant_id, run_id, judgment_id)
- check `verification_finding_blinded_input_artifact_sha256_check`: `((blinded_input_artifact_sha256 IS NULL) OR (blinded_input_artifact_sha256 ~ '^[0-9a-f]{64}$'::text))`
- check `verification_finding_calibrated_probability_check`: `((calibrated_probability >= (0)::numeric) AND (calibrated_probability <= (1)::numeric))`
- check `verification_finding_cost_micros_check`: `((cost_micros IS NULL) OR (cost_micros >= 0))`
- check `verification_finding_judge_kind_check`: `(judge_kind = ANY (ARRAY['deterministic'::text, 'nli'::text, 'llm'::text, 'human'::text, 'policy'::text, 'statistical'::text]))`
- check `verification_finding_latency_ms_check`: `((latency_ms IS NULL) OR (latency_ms >= 0))`
- check `verification_finding_output_schema_sha256_check`: `((output_schema_sha256 IS NULL) OR (output_schema_sha256 ~ '^[0-9a-f]{64}$'::text))`
- check `verification_finding_retries_check`: `((retries IS NULL) OR (retries >= 0))`
- check `verification_finding_token_usage_check`: `((token_usage IS NULL) OR (token_usage >= 0))`
- check `verification_finding_v1_fields_ck`: `((verification_contract_version IS NULL) OR ((tenant_id IS NOT NULL) AND (judgment_id IS NOT NULL) AND (btrim(judgment_id) <> ''::text) AND…`
- check `verification_finding_verification_contract_version_check`: `((verification_contract_version IS NULL) OR (verification_contract_version = 'verification.v1'::text))`
- check `verification_finding_verification_contract_version_ck`: `((verification_contract_version IS NULL) OR (verification_contract_version = 'verification.v1'::text))`

## Relationships

4 outbound and 0 inbound foreign keys; full list in [details](verification_finding.details.md).

## Indexes

2 indexes; see [details](verification_finding.details.md).

## Triggers

2 triggers; see [details](verification_finding.details.md).

## Row-level security

Enabled; 1 policies in [details](verification_finding.details.md).

## Grants

`executor_service`: INSERT, SELECT, UPDATE; `service_role`: INSERT, SELECT, UPDATE; `verifier_agent`: INSERT, SELECT. None: `anon`, `app_reader`, `authenticated`, `control_plane`, `pipeline_agent`.

## Read paths

- Direct SELECT: `executor_service`, `verifier_agent`.

## Write path

- Direct DML: `executor_service`, `verifier_agent`.

## TypeScript

insert: `Database["evidence"]["Tables"]["verification_finding"]["Insert"]`; row: `Database["evidence"]["Tables"]["verification_finding"]["Row"]`; update: `Database["evidence"]["Tables"]["verification_finding"]["Update"]`

Defined in: `20260826000300_evidence_core.sql`.
