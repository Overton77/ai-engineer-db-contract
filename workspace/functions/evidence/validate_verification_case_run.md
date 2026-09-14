---
id: "fn:evidence.validate_verification_case_run()"
kind: function
schema: evidence
name: validate_verification_case_run
domain: evidence
overloads: ["fn:evidence.validate_verification_case_run()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [verification case input artifact must be an available metadata-backed same-tenant verification artifact with an exact digest, verification case requires a same-tenant verification.v1 run, verification case result artifact must be an available metadata-backed same-tenant verification artifact with an exact digest]
touches: { reads: [evidence.verification_run], writes: [] }
tokens: [evidence, validate_verification_case_run, evidence.validate_verification_case_run]
defined_in: ["20260906023000_verification_case_evidence_reads.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.validate_verification_case_run

Domain `evidence`.

## validate_verification_case_run() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `verification case input artifact must be an available metadata-backed same-tenant verification artifact with an exact digest`; `verification case requires a same-tenant verification.v1 run`; `verification case result artifact must be an available metadata-backed same-tenant verification artifact with an exact digest`.

Touches (best effort): reads [`evidence.verification_run`](../../relations/evidence/verification_run.md); writes —; calls [`orchestration.verification_artifact_is_admitted`](../orchestration/verification_artifact_is_admitted.md).

Defined in: `20260906023000_verification_case_evidence_reads.sql`.
