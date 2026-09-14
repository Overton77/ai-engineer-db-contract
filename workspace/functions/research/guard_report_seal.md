---
id: "fn:research.guard_report_seal()"
kind: function
schema: research
name: guard_report_seal
domain: research
overloads: ["fn:research.guard_report_seal()"]
security: definer
volatility: volatile
executors: []
raises: [REPORT_ARTIFACT_UNAVAILABLE, REPORT_ASSERTION_ARTIFACT_MISMATCH, REPORT_ASSERTION_BINDING_MISSING, REPORT_BUCKET_MISMATCH, REPORT_EVIDENCE_MANIFEST_UNAVAILABLE, REPORT_MANIFEST_MISMATCH, REPORT_QUESTION_SECTION_MISSING, REPORT_RENDITION_MISMATCH, REPORT_REQUIRED_ARTIFACTS_MISSING, REPORT_SECTIONS_MISSING, REPORT_TENANT_MISMATCH]
touches: { reads: [orchestration.artifact, research.report_artifact, research.report_assertion, research.report_assertion_claim, research.report_question, research.report_question_section, research.report_section_version, research.report_version], writes: [] }
tokens: [research, guard_report_seal, research.guard_report_seal]
defined_in: ["20260913010000_research_report_packages.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research.guard_report_seal

Domain `research`.

## guard_report_seal() → trigger

function, volatile, security definer, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `REPORT_ARTIFACT_UNAVAILABLE`; `REPORT_ASSERTION_ARTIFACT_MISMATCH`; `REPORT_ASSERTION_BINDING_MISSING`; `REPORT_BUCKET_MISMATCH`; `REPORT_EVIDENCE_MANIFEST_UNAVAILABLE`; `REPORT_MANIFEST_MISMATCH`; `REPORT_QUESTION_SECTION_MISSING`; `REPORT_RENDITION_MISMATCH`; `REPORT_REQUIRED_ARTIFACTS_MISSING`; `REPORT_SECTIONS_MISSING`; `REPORT_TENANT_MISMATCH`.

Touches (best effort): reads [`orchestration.artifact`](../../relations/orchestration/artifact.md), [`research.report_artifact`](../../relations/research/report_artifact.md), [`research.report_assertion`](../../relations/research/report_assertion.md), [`research.report_assertion_claim`](../../relations/research/report_assertion_claim.md), [`research.report_question`](../../relations/research/report_question.md), [`research.report_question_section`](../../relations/research/report_question_section.md), [`research.report_section_version`](../../relations/research/report_section_version.md), [`research.report_version`](../../relations/research/report_version.md); writes —; calls [`util.current_tenant_id`](../util/current_tenant_id.md).

Defined in: `20260913010000_research_report_packages.sql`.
