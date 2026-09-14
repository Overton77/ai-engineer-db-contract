---
id: "task:navigate-report"
kind: task
domains: [research, evidence]
queries: [reports.versions, reports.sections, reports.assertions, reports.questions, reports.dependencies, reports.artifacts, reports.assessments, reports.ingestion_links]
aliases: [report structure, report outline, report gaps, section reuse, report evidence]
provenance: model_assisted
reviewed: null
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# Navigate a report revision, evidence and coverage

Domains: [`research`](../domains/research.md), [`evidence`](../domains/evidence.md). Queries: [`q:reports.versions`](../queries/README.md), [`q:reports.sections`](../queries/README.md), [`q:reports.assertions`](../queries/README.md), [`q:reports.questions`](../queries/README.md), [`q:reports.dependencies`](../queries/README.md), [`q:reports.artifacts`](../queries/README.md), [`q:reports.assessments`](../queries/README.md), [`q:reports.ingestion_links`](../queries/README.md).

## Navigation

`domains/research.md` → choose the named query below; read only the relation needed for the question.

## Operation

Use reports.versions with report_id to choose an exact revision, including legacy versions. All other reports.* queries take report_version_id.

Use reports.sections for the ordered outline, reports.assertions for exact spans and claim bindings, reports.questions for coverage, reports.dependencies for reuse context, reports.artifacts for registered renditions, reports.assessments for later verification links, and reports.ingestion_links for receipts.

For the assembled v1 package use `knowledge report get <reportVersionId>`; resolve returned artifacts through `knowledge artifact get <artifactId>`. Named queries execute as pipeline_agent under the caller tenant.

## Expected shape

Bounded rows (at most 200 per query). Assertion and question joins may return multiple rows per item. A null schema_version from reports.versions denotes a legacy revision. Section projections carry pointers; readable blocks live in the structure/Markdown artifacts.

## Pitfalls

A bounded slice is not a complete package export. Sealed does not mean admitted; missing assessments are not passing verdicts. Do not treat claim bindings as independent corroboration or infer an answer from coverage alone.
