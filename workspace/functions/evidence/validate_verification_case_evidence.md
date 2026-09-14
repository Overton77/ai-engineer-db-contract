---
id: "fn:evidence.validate_verification_case_evidence()"
kind: function
schema: evidence
name: validate_verification_case_evidence
domain: evidence
overloads: ["fn:evidence.validate_verification_case_evidence()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [verification case evidence artifact must be an available metadata-backed same-tenant verification artifact with an exact digest]
touches: { reads: [], writes: [] }
tokens: [evidence, validate_verification_case_evidence, evidence.validate_verification_case_evidence]
defined_in: ["20260906023000_verification_case_evidence_reads.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.validate_verification_case_evidence

Domain `evidence`.

## validate_verification_case_evidence() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `verification case evidence artifact must be an available metadata-backed same-tenant verification artifact with an exact digest`.

Touches (best effort): reads —; writes —; calls [`orchestration.verification_artifact_is_admitted`](../orchestration/verification_artifact_is_admitted.md).

Defined in: `20260906023000_verification_case_evidence_reads.sql`.
