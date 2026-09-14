---
id: "fn:research.guard_report_assessment()"
kind: function
schema: research
name: guard_report_assessment
domain: research
overloads: ["fn:research.guard_report_assessment()"]
security: invoker
volatility: volatile
executors: []
raises: [REPORT_ASSESSMENT_DIGEST_MISMATCH, REPORT_ASSESSMENT_REQUIRES_SEAL, REPORT_ASSESSMENT_RESULT_UNAVAILABLE]
touches: { reads: [orchestration.artifact, research.report_artifact, research.report_package_seal], writes: [] }
tokens: [research, guard_report_assessment, research.guard_report_assessment]
defined_in: ["20260913020000_report_assessment_links.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research.guard_report_assessment

Domain `research`.

## guard_report_assessment() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `REPORT_ASSESSMENT_DIGEST_MISMATCH`; `REPORT_ASSESSMENT_REQUIRES_SEAL`; `REPORT_ASSESSMENT_RESULT_UNAVAILABLE`.

Touches (best effort): reads [`orchestration.artifact`](../../relations/orchestration/artifact.md), [`research.report_artifact`](../../relations/research/report_artifact.md), [`research.report_package_seal`](../../relations/research/report_package_seal.md); writes —; calls —.

Defined in: `20260913020000_report_assessment_links.sql`.
