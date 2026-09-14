---
id: "fn:evidence.validate_verification_run()"
kind: function
schema: evidence
name: validate_verification_run
domain: evidence
overloads: ["fn:evidence.validate_verification_run()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [producer and verifier deployments must be present and distinct, verification bundle/result artifact registration missing, verification manifest artifact binding mismatch, verification mission/work-item lineage mismatch, verification policy artifact binding mismatch]
touches: { reads: [orchestration.attempt, orchestration.work_item], writes: [] }
tokens: [evidence, validate_verification_run, evidence.validate_verification_run]
defined_in: ["20260905010000_verification_persistence_contract.sql", "20260905013000_verification_legacy_compatibility_and_isolation.sql", "20260906021000_verification_artifact_consumer_admission.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.validate_verification_run

Domain `evidence`.

## validate_verification_run() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `producer and verifier deployments must be present and distinct`; `verification bundle/result artifact registration missing`; `verification manifest artifact binding mismatch`; `verification mission/work-item lineage mismatch`; `verification policy artifact binding mismatch`.

Touches (best effort): reads [`orchestration.attempt`](../../relations/orchestration/attempt.md), [`orchestration.work_item`](../../relations/orchestration/work_item.md); writes —; calls [`orchestration.verification_artifact_is_admitted`](../orchestration/verification_artifact_is_admitted.md).

Defined in: `20260905010000_verification_persistence_contract.sql`, `20260905013000_verification_legacy_compatibility_and_isolation.sql`, `20260906021000_verification_artifact_consumer_admission.sql`.
