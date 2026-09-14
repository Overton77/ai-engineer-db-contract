---
id: "fn:evidence.enforce_verified_claim_gate()"
kind: function
schema: evidence
name: enforce_verified_claim_gate
domain: evidence
overloads: ["fn:evidence.enforce_verified_claim_gate()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [verified claim requires directly supported same-run finding and append-only evidence assessment]
touches: { reads: [evidence.claim_evidence_assessment, evidence.claim_evidence_link, evidence.verification_finding, evidence.verification_run], writes: [] }
tokens: [evidence, enforce_verified_claim_gate, evidence.enforce_verified_claim_gate]
defined_in: ["20260829194310_harden_claim_extraction_and_verification_contract.sql", "20260829194915_require_direct_same_run_claim_verification.sql", "20260829194954_normalize_append_only_claim_evidence_assessments.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.enforce_verified_claim_gate

Domain `evidence`.

## enforce_verified_claim_gate() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`. Promotes only fully and directly supported atomic claims; partial or qualified results require a narrowed or superseding claim.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `verified claim requires directly supported same-run finding and append-only evidence assessment`.

Touches (best effort): reads [`evidence.claim_evidence_assessment`](../../relations/evidence/claim_evidence_assessment.md), [`evidence.claim_evidence_link`](../../relations/evidence/claim_evidence_link.md), [`evidence.verification_finding`](../../relations/evidence/verification_finding.md), [`evidence.verification_run`](../../relations/evidence/verification_run.md); writes —; calls —.

Defined in: `20260829194310_harden_claim_extraction_and_verification_contract.sql`, `20260829194915_require_direct_same_run_claim_verification.sql`, `20260829194954_normalize_append_only_claim_evidence_assessments.sql`.
