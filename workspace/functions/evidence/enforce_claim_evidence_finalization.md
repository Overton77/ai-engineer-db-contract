---
id: "fn:evidence.enforce_claim_evidence_finalization()"
kind: function
schema: evidence
name: enforce_claim_evidence_finalization
domain: evidence
overloads: ["fn:evidence.enforce_claim_evidence_finalization()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [claim evidence link permits only one verifier finalization transition, claim evidence links are append-only]
touches: { reads: [], writes: [] }
tokens: [evidence, enforce_claim_evidence_finalization, evidence.enforce_claim_evidence_finalization]
defined_in: ["20260829194743_permit_one_way_claim_evidence_finalization.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.enforce_claim_evidence_finalization

Domain `evidence`.

## enforce_claim_evidence_finalization() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `claim evidence link permits only one verifier finalization transition`; `claim evidence links are append-only`.

Defined in: `20260829194743_permit_one_way_claim_evidence_finalization.sql`.
