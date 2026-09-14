---
id: "rel:research.report_ingestion_link"
kind: table
schema: research
name: report_ingestion_link
domain: research
aliases: [report ingestion lineage, reportBinding]
tokens: [research, report_ingestion_link, research.report_ingestion_link, id, tenant_id, report_version_id, assertion_id, intent_id, proposal_id, receipt_id, outcome, canonical_refs, created_at]
summary: "Append-only proposal, receipt, outcome and canonical-result lineage."
summary_basis: curated
rls: enabled
readers: [app_reader, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
writers: [control_plane, executor_service, service_role]
typescript: "Database[\"research\"][\"Tables\"][\"report_ingestion_link\"][\"Row\"]"
defined_in: ["20260913010000_research_report_packages.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research.report_ingestion_link

table in domain `research`.

> curated (model_assisted, unreviewed) — May arrive after sealing. reportBinding supplements normal ingestion evidence. Interpret receipt outcomes at their owner; this link never changes report content.

## Columns

| # | Column | Type | Null | Default | Notes |
| ---: | --- | --- | --- | --- | --- |
| 1 | `id` | `uuid` | no | `util.uuidv7()` | PK |
| 2 | `tenant_id` | `uuid` | no | `util.current_tenant_id()` | — |
| 3 | `report_version_id` | `uuid` | no | — | — |
| 4 | `assertion_id` | `uuid` | yes | — | — |
| 5 | `intent_id` | `uuid` | no | — | FK → [`orchestration.operation_intent`](../orchestration/operation_intent.md).id |
| 6 | `proposal_id` | `text` | no | — | — |
| 7 | `receipt_id` | `uuid` | yes | — | FK → [`orchestration.operation_receipt`](../orchestration/operation_receipt.md).id |
| 8 | `outcome` | `text` | no | — | — |
| 9 | `canonical_refs` | `jsonb` | no | `'[]'::jsonb` | — |
| 10 | `created_at` | `timestamp with time zone` | no | `now()` | — |

## Constraints

- PK (id)
- check `report_ingestion_link_canonical_refs_check`: `(jsonb_typeof(canonical_refs) = 'array'::text)`
- check `report_ingestion_link_check`: `((outcome <> ALL (ARRAY['applied'::text, 'no_op'::text])) OR (receipt_id IS NOT NULL))`
- check `report_ingestion_link_outcome_check`: `(outcome = ANY (ARRAY['proposed'::text, 'applied'::text, 'held'::text, 'rejected'::text, 'no_op'::text, 'unresolved'::text]))`
- check `report_ingestion_link_proposal_id_check`: `(btrim(proposal_id) <> ''::text)`

## Relationships

Outbound: `intent_id` → [`orchestration.operation_intent`](../orchestration/operation_intent.md)`.id`; `receipt_id` → [`orchestration.operation_receipt`](../orchestration/operation_receipt.md)`.id`; `tenant_id,report_version_id,assertion_id` → [`research.report_assertion`](report_assertion.md)`.tenant_id,report_version_id,id`; `tenant_id,report_version_id` → [`research.report_package`](report_package.md)`.tenant_id,report_version_id`.
Inbound: none.

## Indexes

`report_ingestion_revision`

## Triggers

- `report_ingestion_link_guard` → [`research.guard_report_ingestion_link`](../../functions/research/guard_report_ingestion_link.md)
- `report_row_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md)

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: `(tenant_id = util.current_tenant_id())`

## Grants

`app_reader`: SELECT; `control_plane`: INSERT, SELECT; `executor_service`: INSERT, SELECT; `pipeline_agent`: SELECT; `service_role`: INSERT, SELECT; `verifier_agent`: SELECT. None: `anon`, `authenticated`.

## Read paths

- Named queries: `q:reports.ingestion_links`.
- Direct SELECT: `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`.

## Write path

- Direct DML: `control_plane`, `executor_service`.

## TypeScript

insert: `Database["research"]["Tables"]["report_ingestion_link"]["Insert"]`; row: `Database["research"]["Tables"]["report_ingestion_link"]["Row"]`; update: `Database["research"]["Tables"]["report_ingestion_link"]["Update"]`

Defined in: `20260913010000_research_report_packages.sql`.
