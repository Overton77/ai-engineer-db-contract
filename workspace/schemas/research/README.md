---
id: "sch:research"
kind: schema
name: research
domains: [research]
relations: 20
functions: 4
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research

Mission-scoped outputs: bundles, reports, findings, syntheses, handoffs. Domains: [`research`](../../domains/research.md).

| Relation | Kind | Rows | Summary | Key edges |
| --- | --- | --- | --- | --- |
| [`bundle_artifact`](../../relations/research/bundle_artifact.md) | table | unknown | — | → `orchestration.artifact`, → `research.research_bundle` |
| [`comparison`](../../relations/research/comparison.md) | table | unknown | — | → `orchestration.mission` |
| [`downstream_handoff`](../../relations/research/downstream_handoff.md) | table | unknown | — | → `orchestration.work_item`, → `orchestration.mission`, → `orchestration.artifact` |
| [`finding`](../../relations/research/finding.md) | table | unknown | — | → `orchestration.mission`, → `evidence.claim` |
| [`report`](../../relations/research/report.md) | table | unknown | Tenant report slug and title, optionally tied to a mission. | → `orchestration.mission` |
| [`report_artifact`](../../relations/research/report_artifact.md) | table | unknown | Package artifact roles referencing the shared artifact registry. | → `orchestration.artifact`, → `research.report_package` |
| [`report_assertion`](../../relations/research/report_assertion.md) | table | unknown | Proposition bound to an exact final Markdown span and structured block pointer. | → `orchestration.artifact`, → `research.report_section_version` |
| [`report_assertion_claim`](../../relations/research/report_assertion_claim.md) | table | unknown | Run-qualified claim identity, evidence manifest, role and optional canonical claim. | → `evidence.claim`, → `orchestration.artifact`, → `research.report_assertion` |
| [`report_assessment`](../../relations/research/report_assessment.md) | table | unknown | Post-seal result artifact bound to an exact report digest. | → `orchestration.artifact`, → `research.report_package`, → `evidence.verification_run` |
| [`report_claim`](../../relations/research/report_claim.md) | table | unknown | — | → `evidence.claim`, → `research.report_version` |
| [`report_ingestion_link`](../../relations/research/report_ingestion_link.md) | table | unknown | Append-only proposal, receipt, outcome and canonical-result lineage. | → `orchestration.operation_intent`, → `orchestration.operation_receipt`, → `research.report_assertion`, → `research.report_package` |
| [`report_package`](../../relations/research/report_package.md) | table | unknown | Version scope, cutoff, producer, authoring mode and predecessor. | → `orchestration.attempt`, → `research.report_version` |
| [`report_package_seal`](../../relations/research/report_package_seal.md) | table | unknown | Immutable structural registration seal for available package artifacts. | → `orchestration.artifact`, → `research.report_package` |
| [`report_question`](../../relations/research/report_question.md) | table | unknown | Original research questions, coverage, explanations and missing evidence. | → `research.report_package` |
| [`report_question_section`](../../relations/research/report_question_section.md) | table | unknown | Question-to-section links within an exact report revision. | → `research.report_question`, → `research.report_section_version` |
| [`report_section`](../../relations/research/report_section.md) | table | unknown | Stable section key within one report. | → `research.report` |
| [`report_section_dependency`](../../relations/research/report_section_dependency.md) | table | unknown | Exact section-revision dependencies for context, derivation and supersession. | → `research.report_section_version` |
| [`report_section_version`](../../relations/research/report_section_version.md) | table | unknown | Ordered heading, question, conclusion, context and JSON pointer for an exact revision. | → `research.report_package`, → `research.report_section` |
| [`report_version`](../../relations/research/report_version.md) | table | unknown | Immutable revision and primary Markdown/JSON references. | → `evaluation.eval_run`, → `orchestration.artifact`, → `research.report` |
| [`research_bundle`](../../relations/research/research_bundle.md) | table | unknown | — | → `orchestration.artifact`, → `orchestration.mission` |

Functions: [`guard_report_assessment`](../../functions/research/guard_report_assessment.md), [`guard_report_ingestion_link`](../../functions/research/guard_report_ingestion_link.md), [`guard_report_projection`](../../functions/research/guard_report_projection.md), [`guard_report_seal`](../../functions/research/guard_report_seal.md).

Types: [`types/research.md`](../../types/research.md).
