---
id: "fn:evaluation.enforce_verification_benchmark_run_lifecycle()"
kind: function
schema: evaluation
name: enforce_verification_benchmark_run_lifecycle
domain: evaluation
overloads: ["fn:evaluation.enforce_verification_benchmark_run_lifecycle()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [benchmark run permits only complete then seal transitions, benchmark runs are append-only]
touches: { reads: [], writes: [] }
tokens: [evaluation, enforce_verification_benchmark_run_lifecycle, evaluation.enforce_verification_benchmark_run_lifecycle]
defined_in: ["20260906029000_verification_benchmark_durable_run.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evaluation.enforce_verification_benchmark_run_lifecycle

Domain `evaluation`.

## enforce_verification_benchmark_run_lifecycle() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `benchmark run permits only complete then seal transitions`; `benchmark runs are append-only`.

Defined in: `20260906029000_verification_benchmark_durable_run.sql`.
