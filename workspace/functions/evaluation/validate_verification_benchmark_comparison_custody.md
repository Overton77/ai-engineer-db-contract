---
id: "fn:evaluation.validate_verification_benchmark_comparison_custody()"
kind: function
schema: evaluation
name: validate_verification_benchmark_comparison_custody
domain: evaluation
overloads: ["fn:evaluation.validate_verification_benchmark_comparison_custody()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [benchmark comparison dirty runtime source custody required, benchmark comparison publication custody mismatch, benchmark comparison result custody mismatch, benchmark comparison runtime artifact custody mismatch]
touches: { reads: [orchestration.verification_artifact_metadata], writes: [] }
tokens: [evaluation, validate_verification_benchmark_comparison_custody, evaluation.validate_verification_benchmark_comparison_custody]
defined_in: ["20260906030800_verification_benchmark_comparison_custody.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evaluation.validate_verification_benchmark_comparison_custody

Domain `evaluation`.

## validate_verification_benchmark_comparison_custody() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `benchmark comparison dirty runtime source custody required`; `benchmark comparison publication custody mismatch`; `benchmark comparison result custody mismatch`; `benchmark comparison runtime artifact custody mismatch`.

Touches (best effort): reads [`orchestration.verification_artifact_metadata`](../../relations/orchestration/verification_artifact_metadata.md); writes —; calls [`orchestration.verification_artifact_is_admitted`](../orchestration/verification_artifact_is_admitted.md).

Defined in: `20260906030800_verification_benchmark_comparison_custody.sql`.
