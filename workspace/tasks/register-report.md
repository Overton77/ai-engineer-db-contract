---
id: "task:register-report"
kind: task
domains: [research, orchestration-ledger]
queries: [reports.versions, reports.artifacts]
aliases: [report registration, incremental report, post research report]
provenance: model_assisted
reviewed: null
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# Register an immutable report package revision

Domains: [`research`](../domains/research.md), [`orchestration-ledger`](../domains/orchestration-ledger.md). Queries: [`q:reports.versions`](../queries/README.md), [`q:reports.artifacts`](../queries/README.md).

## Navigation

`domains/research.md` → `research.report_package` → `research.report_package_seal`.

## Operation

Author research-report.v1 with report/revision identity, scope, cutoff, producer, ordered sections, blocks, assertions, run-qualified evidence references and original-question coverage. Call `knowledge report register report.json` (MCP report_register). Both incremental and post_research authoring support an optional mission.

Register a new immutable revision for changed content. KS renders final Markdown spans, verifies artifact readback and registers projections transactionally. Follow `knowledge report get <reportVersionId>` to inspect the result.

## Expected shape

Registration reports sealed or storage_pending and admission: not_evaluated. A sealed revision has structure, Markdown and manifest artifacts plus structural projections. Post-seal assessments and ingestion links remain separate lifecycle records.

## Pitfalls

Do not insert projections directly or invent producer attempts. storage_pending needs actual storage reconciliation. Registration is separate from legacy report.publish and from verification/admission. Attach reportBinding to normal ingestion proposals to retain receipt lineage.
