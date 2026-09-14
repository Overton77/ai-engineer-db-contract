---
id: "fn:evidence.enforce_producer_not_verifier()"
kind: function
schema: evidence
name: enforce_producer_not_verifier
domain: evidence
overloads: ["fn:evidence.enforce_producer_not_verifier()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: ["producer may not verify its own claim: deployment % produced claim % and is verifying it"]
touches: { reads: [evidence.claim, evidence.verification_run, orchestration.attempt], writes: [] }
tokens: [evidence, enforce_producer_not_verifier, evidence.enforce_producer_not_verifier]
defined_in: ["20260826000300_evidence_core.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.enforce_producer_not_verifier

Domain `evidence`.

## enforce_producer_not_verifier() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `producer may not verify its own claim: deployment % produced claim % and is verifying it`.

Touches (best effort): reads [`evidence.claim`](../../relations/evidence/claim.md), [`evidence.verification_run`](../../relations/evidence/verification_run.md), [`orchestration.attempt`](../../relations/orchestration/attempt.md); writes —; calls —.

Defined in: `20260826000300_evidence_core.sql`.
