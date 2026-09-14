---
id: "fn:research.guard_report_ingestion_link()"
kind: function
schema: research
name: guard_report_ingestion_link
domain: research
overloads: ["fn:research.guard_report_ingestion_link()"]
security: invoker
volatility: volatile
executors: []
raises: [REPORT_INGESTION_RECEIPT_MISMATCH, REPORT_INGESTION_TENANT_MISMATCH]
touches: { reads: [orchestration.operation_intent, orchestration.operation_receipt], writes: [] }
tokens: [research, guard_report_ingestion_link, research.guard_report_ingestion_link]
defined_in: ["20260913010000_research_report_packages.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research.guard_report_ingestion_link

Domain `research`.

## guard_report_ingestion_link() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `REPORT_INGESTION_RECEIPT_MISMATCH`; `REPORT_INGESTION_TENANT_MISMATCH`.

Touches (best effort): reads [`orchestration.operation_intent`](../../relations/orchestration/operation_intent.md), [`orchestration.operation_receipt`](../../relations/orchestration/operation_receipt.md); writes —; calls —.

Defined in: `20260913010000_research_report_packages.sql`.
